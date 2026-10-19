#!/usr/bin/env python3
# /// script
# requires-python = ">=3.10"
# dependencies = ["UnityPy>=1.25", "pillow"]
# ///
"""
Generate the logbook data and icons from a local Risk of Rain 2 install.

Mirrors how the game builds its logbook (RoR2.UI.LogBook.LogBookController):
which items, equipment, monsters, stages, survivors and drones appear, and the
save-file keys that unlock them. Writes src/data/logbook/<category>.ts and
public/logbook/<entry-id>.webp, keeping existing entry ids and names stable.
The "karma" target writes the starting karma levels (src/data/karma-levels.ts,
public/karma/level-<n>.webp), mirroring RoR2.KarmaManager.

Usage:
  uv run scripts/generate-logbook.py [--game "<path>"] [--only items,equipment]
"""

import argparse
import base64
import io
import json
import re
import struct
import subprocess
import sys
from functools import lru_cache
from pathlib import Path

import lz4.block
import UnityPy
from PIL import Image

ROOT = Path(__file__).resolve().parent.parent
OUT_DIR = ROOT / "public" / "logbook"
ICON_SIZE = 96  # displayed at 48px; 2x for high-DPI screens
# Generic textures the game falls back to when a body has no real portrait
PLACEHOLDER_ICONS = {"texNullIcon", "texMysteryIcon"}
DEFAULT_GAME = Path.home() / ".local/share/Steam/steamapps/common/Risk of Rain 2"


# ---------------------------------------------------------------------------
# Addressables catalog
# ---------------------------------------------------------------------------


def load_catalog(aa: Path):
    """Return (asset path -> bundle files, addressable key -> asset paths)."""
    c = json.loads((aa / "catalog.json").read_text())
    ids = c["m_InternalIds"]
    kd = base64.b64decode(c["m_KeyDataString"])
    bd = base64.b64decode(c["m_BucketDataString"])
    ed = base64.b64decode(c["m_EntryDataString"])

    def read_key(off):
        kind = kd[off]
        off += 1
        if kind in (0, 1):  # ASCII / UTF-16 string
            n = struct.unpack_from("<i", kd, off)[0]
            raw = kd[off + 4 : off + 4 + n]
            return raw.decode("ascii" if kind == 0 else "utf-16-le", "replace")
        return None

    count = struct.unpack_from("<i", bd, 0)[0]
    off = 4
    buckets = []
    for _ in range(count):
        data_off, n = struct.unpack_from("<ii", bd, off)
        off += 8
        buckets.append((data_off, struct.unpack_from(f"<{n}i", bd, off)))
        off += 4 * n

    n_entries = struct.unpack_from("<i", ed, 0)[0]
    entries = [struct.unpack_from("<7i", ed, 4 + 28 * i) for i in range(n_entries)]

    def internal_id(i):
        """Asset path, or just the file name for bundles."""
        path = ids[entries[i][0]]
        return path.split("\\")[-1] if path.endswith(".bundle") else path

    key_to_paths = {}
    for data_off, ents in buckets:
        key = read_key(data_off)
        if key:
            key_to_paths.setdefault(key, []).extend(internal_id(e) for e in ents)

    asset_bundles = {}
    for i, (_, _, dep_key, *_rest) in enumerate(entries):
        path = internal_id(i)
        if dep_key >= 0 and not path.endswith(".bundle"):
            deps = [internal_id(e) for e in buckets[dep_key][1]]
            asset_bundles[path] = [d for d in deps if d.endswith(".bundle")]
    return asset_bundles, key_to_paths


def bundle_files(path: Path) -> list[str]:
    """Names of the serialized files (CAB-...) inside a UnityFS bundle, read from its header."""
    with open(path, "rb") as f:
        head = f.read(4096)
        pos = head.index(b"\0") + 1  # signature
        version = struct.unpack_from(">I", head, pos)[0]
        pos += 4
        pos = head.index(b"\0", pos) + 1  # unity version
        pos = head.index(b"\0", pos) + 1  # unity revision
        size, packed, unpacked, flags = struct.unpack_from(">qIII", head, pos)
        pos += 20
        if version >= 7:
            pos = (pos + 15) // 16 * 16
        f.seek(size - packed if flags & 0x80 else pos)
        info = f.read(packed)
    if flags & 0x3F in (2, 3):
        info = lz4.block.decompress(info, uncompressed_size=unpacked)
    off = 16
    blocks = struct.unpack_from(">i", info, off)[0]
    off += 4 + blocks * 10
    nodes = struct.unpack_from(">i", info, off)[0]
    off += 4
    names = []
    for _ in range(nodes):
        off += 20
        end = info.index(b"\0", off)
        names.append(info[off:end].decode())
        off = end + 1
    return names


def load_body_icon_guids(managed: Path) -> dict:
    """
    BodyCatalog loads "Textures/BodyIcons/<Body>" through LegacyResourcesAPI and
    uses it instead of the prefab's portraitIcon. LegacyResourcesAPI.dll stores
    that legacy path -> asset GUID table as consecutive string literals.
    """
    raw = (managed / "LegacyResourcesAPI.dll").read_bytes()
    pairs = re.finditer(
        rb"((?:[\x20-\x7e]\x00){4,})\x00.((?:[0-9a-f]\x00){32})\x00", raw, re.S
    )
    prefix = "textures/bodyicons/"
    out = {}
    for m in pairs:
        path = m.group(1).decode("utf-16-le")
        if path.lower().startswith(prefix):
            out[path[len(prefix) :].lower()] = m.group(2).decode("utf-16-le")
    return out


# ---------------------------------------------------------------------------
# Game data helpers
# ---------------------------------------------------------------------------


def load_english(lang_dir: Path) -> dict:
    strings = {}
    for f in lang_dir.glob("*.json"):
        text = re.sub(r",(\s*[}\]])", r"\1", f.read_text(encoding="utf-8-sig"))
        try:
            strings.update(json.loads(text).get("strings", {}))
        except json.JSONDecodeError:
            pass
    return strings


def clean(s: str) -> str:
    """Normalized text for comparing names (no rich text, straight quotes)."""
    s = re.sub(r"<[^>]+>", "", s or "").replace("\u2019", "'")
    return s.strip().lower()


class Game:
    def __init__(self, game: Path):
        data = game / "Risk of Rain 2_Data" / "StreamingAssets"
        self.bundles_dir = data / "aa" / "StandaloneWindows64"
        print("Reading Addressables catalog…", file=sys.stderr)
        self.asset_bundles, self.keys = load_catalog(data / "aa")
        self.english = load_english(data / "Language" / "en")
        self.lrapi = json.loads((data / "lrapi_returns.json").read_text())
        self.prefabs = {
            Path(p).stem: p for p in self.asset_bundles if p.endswith(".prefab")
        }
        self.body_icons = load_body_icon_guids(game / "Risk of Rain 2_Data" / "Managed")

    @lru_cache(maxsize=64)
    def env(self, bundle: str):
        return UnityPy.load(str(self.bundles_dir / bundle))

    def defs_of(self, path: str):
        """Yield (object, typetree) for every MonoBehaviour in an asset's bundle."""
        env = self.env(self.asset_bundles[path][0])
        for obj in env.objects:
            if obj.type.name == "MonoBehaviour":
                try:
                    yield obj, obj.read_typetree()
                except Exception:
                    continue

    def components_of(self, prefab: str):
        """(object, typetree) for MonoBehaviours on the prefab's root GameObject."""
        for obj, t in self.defs_of(self.prefabs[prefab]):
            go = obj.assets_file.objects.get(t.get("m_GameObject", {}).get("m_PathID"))
            if go and go.peek_name() == prefab:
                yield obj, t

    def paths_of_type(self, type_name: str):
        for guid, v in self.lrapi.items():
            if v.get("typeName") == type_name:
                for p in self.keys.get(guid, []):
                    if p in self.asset_bundles:
                        yield p
                        break

    @property
    def cab_index(self) -> dict:
        """Serialized file name (CAB-...) -> bundle, built lazily from headers."""
        if not hasattr(self, "_cab_index"):
            print("Indexing bundle headers…", file=sys.stderr)
            self._cab_index = {
                name: bundle.name
                for bundle in self.bundles_dir.glob("*.bundle")
                for name in bundle_files(bundle)
            }
        return self._cab_index

    def image_from_pptr(self, obj, pptr):
        target = self.deref(obj, pptr)
        if not target:
            return None
        data = target.read()
        return None if data.m_Name in PLACEHOLDER_ICONS else data.image

    def deref(self, obj, pptr):
        """Resolve a PPtr, following it into another bundle if needed."""
        if not pptr or not pptr.get("m_PathID"):
            return None
        path_id = pptr["m_PathID"]
        if pptr["m_FileID"] == 0:
            target = obj.assets_file.objects.get(path_id)
        else:
            ext = obj.assets_file.externals[pptr["m_FileID"] - 1].path
            cab = ext.split("/")[-1]
            bundle = self.cab_index.get(cab)
            objects = self.env(bundle).objects if bundle else []
            target = next(
                (
                    o
                    for o in objects
                    if o.path_id == path_id and o.assets_file.name == cab
                ),
                None,
            )
        return target

    def image_from_reference(self, ref):
        guid = (ref or {}).get("m_AssetGUID")
        if not guid:
            return None
        for path in self.keys.get(guid, []):
            if path not in self.asset_bundles:
                continue
            want = ref.get("m_SubObjectName") or Path(path).stem
            for obj in self.env(self.asset_bundles[path][0]).objects:
                if obj.type.name in ("Sprite", "Texture2D") and obj.peek_name() == want:
                    return obj.read().image
        return None

    def name_of(self, obj, pptr):
        """m_Name of the asset a PPtr points to (e.g. an UnlockableDef)."""
        target = self.deref(obj, pptr)
        if not target:
            return None
        if target.type.name == "MonoBehaviour":
            return target.read_typetree().get("m_Name")
        return target.peek_name()

    def dlc_of(self, obj, pptr) -> str:
        return EXPANSION_DLC.get(self.name_of(obj, pptr), "base")

    @property
    def unlockables(self) -> set:
        """
        Names of the log UnlockableDefs. The save key is the asset's m_Name,
        which can differ in case from its file name (Logs.Stages.Nest.asset is
        "Logs.Stages.nest"), and the game's lookup is case-sensitive.
        """
        if not hasattr(self, "_unlockables"):
            self._unlockables = set()
            for path in self.asset_bundles:
                if not re.search(r"/Logs?\.[^/]*\.asset$", path):
                    continue
                stem = Path(path).stem.lower()
                for _, t in self.defs_of(path):
                    if t.get("m_Name", "").lower() == stem:
                        self._unlockables.add(t["m_Name"])
                        break
        return self._unlockables


# ---------------------------------------------------------------------------
# Game logbook contents (mirrors RoR2.UI.LogBook.LogBookController)
# ---------------------------------------------------------------------------

EXPANSION_DLC = {"DLC1": "sotv", "DLC2": "sots", "DLC3": "ac", "DLC4": "hc"}
TIER_RARITY = {
    0: "common",
    1: "uncommon",
    2: "legendary",
    3: "lunar",
    4: "boss",
    6: "void",
    7: "void",
    8: "void",
    9: "void",
}


def is_expansion_requirement(t: dict) -> bool:
    """An ExpansionRequirementComponent: only requiredExpansion besides Unity's fields."""
    return set(t) >= {"requiredExpansion", "m_Script"} and len(t) <= 6


def body_icon(game: Game, body: str):
    """Portrait the game shows for a body (see BodyCatalog.FinishAsyncLoads)."""
    guid = game.body_icons.get(body.lower())
    if guid:
        img = game.image_from_reference({"m_AssetGUID": guid})
        if img:
            return img
    if body in game.prefabs:
        for obj, t in game.components_of(body):
            if "portraitIcon" in t and "baseNameToken" in t:
                return game.image_from_pptr(obj, t["portraitIcon"])
    return None


def item_tiers(game: Game) -> dict:
    """ItemTier enum value -> isDroppable."""
    tiers = {}
    for path in game.paths_of_type("ItemTierDef"):
        for _, t in game.defs_of(path):
            if "isDroppable" in t and "_tier" in t:
                tiers[t["_tier"]] = bool(t["isDroppable"])
    return tiers


def read_pickups(game: Game, type_name: str, prefix: str):
    """Items (CanSelectItemEntry), equipment (canDrop) and key items (!hidden)."""
    tiers = item_tiers(game) if type_name == "ItemDef" else {}
    out = []
    for path in game.paths_of_type(type_name):
        stem = Path(path).stem
        for obj, t in game.defs_of(path):
            if t.get("m_Name") != stem or "nameToken" not in t:
                continue
            rarity = None
            if type_name == "ItemDef":
                tier = t.get("deprecatedTier")
                tier_def = game.deref(obj, t.get("_itemTierDef"))
                if tier_def:
                    tier = tier_def.read_typetree().get("_tier", tier)
                if not tiers.get(tier):
                    continue
                rarity = TIER_RARITY.get(tier)
            elif type_name == "EquipmentDef":
                if not t.get("canDrop"):
                    continue
                rarity = "lunar" if t.get("isLunar") else "equipment"
            elif t.get("hidden"):
                continue

            def icon(obj=obj, t=t):
                return (
                    game.image_from_reference(t.get("pickupIconSpriteReference"))
                    or game.image_from_pptr(obj, t.get("pickupIconSprite"))
                    or game.image_from_pptr(obj, t.get("pickupIconTexture"))
                )

            out.append(
                {
                    "internal": stem,
                    "name": clean_name(game.english.get(t["nameToken"]) or stem),
                    "pickupId": f"{prefix}.{stem}",
                    "unlockId": game.name_of(obj, t.get("unlockableDef")),
                    "dlc": game.dlc_of(obj, t.get("requiredExpansion")),
                    "rarity": rarity,
                    "icon": icon,
                }
            )
    return out


def read_monsters(game: Game):
    """Bodies with a DeathRewards.logUnlockableDef, deduplicated by name token."""
    by_token = {}
    for body in game.prefabs:
        if "Body" not in body:
            continue
        body_t = log = None
        dlc = "base"
        for obj, t in game.components_of(body):
            if "baseNameToken" in t and "portraitIcon" in t:
                body_t = t
            elif "logUnlockableDef" in t:
                log = game.name_of(obj, t["logUnlockableDef"])
            elif is_expansion_requirement(t):
                dlc = game.dlc_of(obj, t["requiredExpansion"])
        if not body_t or not log or log not in game.unlockables:
            continue
        token = body_t["baseNameToken"]
        entry = {
            "internal": body,
            "name": clean_name(game.english.get(token) or body),
            "unlockId": log,
            "dlc": dlc,
            "health": body_t.get("baseMaxHealth", 0),
            "icon": lambda body=body: body_icon(game, body),
        }
        if token not in by_token or entry["health"] < by_token[token]["health"]:
            by_token[token] = entry
    return list(by_token.values())


def read_stages(game: Game):
    """SceneDefs with shouldIncludeInLogbook whose Logs.Stages.<base> exists."""
    out, seen = [], set()
    for path in game.paths_of_type("SceneDef"):
        for obj, t in game.defs_of(path):
            if t.get("m_Name") != Path(path).stem or "previewTexture" not in t:
                continue
            if not t.get("shouldIncludeInLogbook"):
                continue
            base = t.get("baseSceneNameOverride") or t.get("m_Name")
            log = f"Logs.Stages.{base}"
            if log not in game.unlockables or log in seen:
                continue
            seen.add(log)

            def icon(obj=obj, t=t):
                return game.image_from_reference(
                    t.get("previewTextureReference")
                ) or game.image_from_pptr(obj, t.get("previewTexture"))

            out.append(
                {
                    "internal": base,
                    "name": clean_name(game.english.get(t.get("nameToken")) or base),
                    "unlockId": log,
                    "dlc": game.dlc_of(obj, t.get("requiredExpansion")),
                    "icon": icon,
                }
            )
    return out


def body_dlc(game: Game, body: str) -> str:
    for obj, t in game.components_of(body):
        if is_expansion_requirement(t):
            return game.dlc_of(obj, t["requiredExpansion"])
    return "base"


def read_survivors(game: Game):
    """Every SurvivorDef: survivor unlockable + body (for totalWins.<Body>)."""
    out = []
    for path in game.paths_of_type("SurvivorDef"):
        for obj, t in game.defs_of(path):
            if t.get("m_Name") != Path(path).stem or "displayNameToken" not in t:
                continue
            body = game.name_of(obj, t["bodyPrefab"])
            out.append(
                {
                    "internal": body,
                    "name": clean_name(game.english.get(t["displayNameToken"]) or body),
                    "unlockId": game.name_of(obj, t.get("unlockableDef")),
                    "body": body,
                    "dlc": body_dlc(game, body),
                    "icon": lambda body=body: body_icon(game, body),
                }
            )
    return out


def read_drones(game: Game):
    """DroneDefs: DroneIndex.<name> pickup + body (for timesSummoned.<Body>)."""
    out = []
    for path in game.paths_of_type("DroneDef"):
        for obj, t in game.defs_of(path):
            if t.get("m_Name") != Path(path).stem or "iconSprite" not in t:
                continue

            def icon(obj=obj, t=t):
                return game.image_from_reference(
                    t.get("iconSpriteReference")
                ) or game.image_from_pptr(obj, t.get("iconSprite"))

            out.append(
                {
                    "internal": t["m_Name"],
                    "name": clean_name(
                        game.english.get(t.get("nameToken")) or t["m_Name"]
                    ),
                    "pickupId": f"DroneIndex.{t['m_Name']}",
                    "body": game.name_of(obj, t["bodyPrefab"]),
                    "dlc": game.dlc_of(obj, t.get("requiredExpansion")),
                    "icon": icon,
                }
            )
    return out


# ---------------------------------------------------------------------------
# Starting karma levels (mirrors RoR2.KarmaManager and RuleDef.FromKarma)
# ---------------------------------------------------------------------------

MAX_KARMA = 8  # KarmaManager.maxKarma
# GatherStartingKarmaUnlockables hardcodes level 0's gate, then adds the
# Karma.StartingKarma.<i> defs that exist, skipping missing ones
KARMA_LEVEL_ZERO_GATE = "Characters.Captain"
# The textures behind KarmaManager.GetLevelIconGuid(level)
KARMA_ICON = "Assets/RoR2/Base/Common/Karma/UI/texKarmaIconLevel{}Active.png"


def has_unlockable(game: Game, name: str) -> bool:
    """An UnlockableDef the game loads (Addressables label) with this exact name."""
    for path in dict.fromkeys(game.keys.get("UnlockableDef", [])):
        if Path(path).stem.lower() == name.lower() and path in game.asset_bundles:
            if any(t.get("m_Name") == name for _, t in game.defs_of(path)):
                return True
    return False


def texture_at(game: Game, path: str):
    for obj in game.env(game.asset_bundles[path][0]).objects:
        if obj.type.name == "Texture2D" and obj.peek_name() == Path(path).stem:
            return obj.read().image
    return None


def generate_karma(game: Game):
    """Write src/data/karma-levels.ts and public/karma/level-<n>.webp."""
    if not has_unlockable(game, KARMA_LEVEL_ZERO_GATE):
        raise SystemExit(f"UnlockableDef {KARMA_LEVEL_ZERO_GATE} not found")
    gates = [KARMA_LEVEL_ZERO_GATE] + [
        f"Karma.StartingKarma.{i}"
        for i in range(1, MAX_KARMA + 1)
        if has_unlockable(game, f"Karma.StartingKarma.{i}")
    ]
    out_dir = ROOT / "public" / "karma"
    out_dir.mkdir(parents=True, exist_ok=True)
    rows, report = [], {"no_gate": [], "no_icon": []}
    for level in range(MAX_KARMA + 1):
        token = "NOKARMA" if level == 0 else str(level)
        # GetRequiredUnlockableForKarmaLevel: ListUtils.GetSafe(list, level),
        # so a missing def shifts the later gates and leaves the top ones open
        gate = gates[level] if level < len(gates) else None
        if not gate:
            report["no_gate"].append(str(level))
        row = {
            "level": level,
            "name": clean_name(game.english.get(f"RULE_KARMASLIDER_{token}_NAME")),
            "description": clean_name(
                game.english.get(f"RULE_KARMASLIDER_{token}_DESC")
            ),
            "unlockId": gate,
        }
        icon = KARMA_ICON.format(level)
        img = texture_at(game, icon) if icon in game.asset_bundles else None
        if img is not None:
            img = img.convert("RGBA")
            img.thumbnail((ICON_SIZE, ICON_SIZE), Image.LANCZOS)
            img.save(out_dir / f"level-{level}.webp", "WEBP", quality=80, method=6)
            row["image"] = f"/karma/level-{level}.webp"
        else:
            report["no_icon"].append(str(level))
        rows.append(row)

    body = "\n".join(
        "  {\n"
        + "\n".join(
            f"    {k}: {json.dumps(v, ensure_ascii=False)},"
            for k, v in row.items()
            if v is not None
        )
        + "\n  },"
        for row in rows
    )
    (ROOT / "src/data/karma-levels.ts").write_text(
        "// Generated by scripts/generate-logbook.py from the game files. Do not edit.\n\n"
        "/** A starting karma choice in the run rules (RuleDef.FromKarma) */\n"
        "export interface StartingKarmaLevel {\n"
        "  level: number;\n"
        "  name: string;\n"
        "  description: string;\n"
        "  // Unlockable in stats.unlock that makes the choice selectable\n"
        "  // (KarmaManager.GetRequiredUnlockableForKarmaLevel); absent = always\n"
        "  unlockId?: string;\n"
        "  image?: string;\n"
        "}\n\n"
        f"export const startingKarmaLevels: StartingKarmaLevel[] = [\n{body}\n];\n"
    )
    return len(rows), report


def clean_name(s: str) -> str:
    """Strip rich text and the decorative glitch characters some names use."""
    s = re.sub(r"<[^>]+>", "", s or "")
    return re.sub(r"[「」『』]|\?\?", "", s).strip()


READERS = {
    "items": lambda g: (
        read_pickups(g, "ItemDef", "ItemIndex")
        + read_pickups(g, "KeyItemDef", "KeyItemIndex")
    ),
    "equipment": lambda g: read_pickups(g, "EquipmentDef", "EquipmentIndex"),
    "monsters": read_monsters,
    "environments": read_stages,
    "survivors": read_survivors,
    "drones": read_drones,
}
ID_PREFIX = {
    "items": "item-",
    "equipment": "equip-",
    "monsters": "",
    "environments": "env-",
    "survivors": "survivor-",
    "drones": "drone-",
}
# Targets with their own output instead of a logbook category
EXTRA_GENERATORS = {"karma": generate_karma}
EXPORT_NAME = {
    "items": "itemEntries",
    "equipment": "equipmentEntries",
    "monsters": "monsterEntries",
    "environments": "environmentEntries",
    "survivors": "survivorEntries",
    "drones": "droneEntries",
}


# ---------------------------------------------------------------------------
# Matching existing entries and writing src/data/logbook/<category>.ts
# ---------------------------------------------------------------------------


def load_entries():
    script = (
        'import {logbookEntries} from "./src/data/logbook-entries.ts";'
        "console.log(JSON.stringify(logbookEntries))"
    )
    out = subprocess.run(
        ["bun", "-e", script], cwd=ROOT, capture_output=True, text=True, check=True
    )
    return json.loads(out.stdout)


def slug(s: str) -> str:
    return re.sub(r"[^a-z0-9]+", "-", s.lower()).strip("-")


def match(existing: list, game_entry: dict, used: set):
    """Find the existing entry for a game entry, so ids/names stay stable."""
    # A pickup identifies an entry; an unlockable only does when the entry has
    # no pickup (several items can share one gate, e.g. Items.ElementalRings).
    pickup, unlock = game_entry.get("pickupId"), game_entry.get("unlockId")
    key, field = (pickup, "pickupId") if pickup else (unlock, "unlockId")
    internal = game_entry["internal"].lower()
    for e in existing:
        if key and e["id"] not in used and e.get(field) == key:
            return e
    for e in existing:
        if e["id"] in used:
            continue
        guess = re.sub(
            r"^(Logs\.(Stages\.)?|\w+Index\.)|\.0$",
            "",
            e.get("pickupId") or e.get("unlockId") or "",
        )
        if guess.lower() in (internal, internal.removesuffix("body")):
            return e
    names = [
        e
        for e in existing
        if e["id"] not in used and clean(e["name"]) == clean(game_entry["name"])
    ]
    return names[0] if len(names) == 1 else None


def ts_entry(e: dict) -> str:
    fields = [
        "id",
        "name",
        "description",
        "category",
        "unlockId",
        "pickupId",
        "body",
        "dlc",
        "rarity",
        "image",
    ]
    lines = [
        f"    {f}: {json.dumps(e[f], ensure_ascii=False)}," for f in fields if e.get(f)
    ]
    return "  {\n" + "\n".join(lines) + "\n  },"


def save_icon(img: Image.Image, entry_id: str):
    img = img.convert("RGBA")
    img.thumbnail((ICON_SIZE, ICON_SIZE), Image.LANCZOS)
    buf = io.BytesIO()
    img.save(buf, "WEBP", quality=80, method=6)
    (OUT_DIR / f"{entry_id}.webp").write_bytes(buf.getvalue())


def generate(game: Game, category: str, existing_all: list):
    existing = [e for e in existing_all if e["category"] == category]
    game_entries = READERS[category](game)
    used, rows = set(), []
    for g in game_entries:
        e = match(existing, g, used)
        if e:
            used.add(e["id"])
        rows.append((e, g))

    order = {e["id"]: i for i, e in enumerate(existing)}
    rows.sort(
        key=lambda r: (order.get(r[0]["id"], 1e9) if r[0] else 1e9, clean(r[1]["name"]))
    )

    taken = {e["id"] for e in existing_all}
    out = []
    report = {"changed": [], "renamed": [], "added": [], "removed": [], "no_icon": []}
    for e, g in rows:
        if e:
            entry_id = e["id"]
            # Keep a disambiguated existing name ("Lunar Chimera (Golem)"),
            # otherwise use the game's name.
            same = clean(e["name"]).startswith(clean(g["name"]))
            name = e["name"] if same else g["name"]
            if not same:
                report["renamed"].append(f"{entry_id}: {e['name']} -> {name}")
        else:
            entry_id = ID_PREFIX[category] + slug(
                g["internal"]
                if category in ("items", "equipment", "environments")
                else g["name"]
            )
            while entry_id in taken:
                entry_id += "-2"
            taken.add(entry_id)
            name = g["name"]
            report["added"].append(f"{entry_id} ({name})")
        new = {
            "id": entry_id,
            "name": name,
            "description": (e or {}).get("description"),
            "category": category,
            "unlockId": g.get("unlockId"),
            "pickupId": g.get("pickupId"),
            "body": g.get("body"),
            "dlc": g["dlc"],
            "rarity": g.get("rarity") or (e or {}).get("rarity"),
        }
        if e:
            diff = {
                k: (e.get(k), new[k])
                for k in ("unlockId", "pickupId", "body", "dlc", "rarity")
                if e.get(k) != new[k]
            }
            if diff:
                report["changed"].append(f"{entry_id}: {diff}")
        img = g["icon"]()
        if img is not None:
            save_icon(img, entry_id)
            new["image"] = f"/logbook/{entry_id}.webp"
        else:
            report["no_icon"].append(entry_id)
        out.append(new)

    # Entries the game lists under the same name (e.g. the Bulwark's Ambry
    # variants) get their internal name appended so they can be told apart.
    seen = set()
    for entry, (_, g) in zip(out, rows):
        if clean(entry["name"]) in seen:
            entry["name"] = f"{g['name']} ({g['internal']})"
        seen.add(clean(entry["name"]))

    for e in existing:
        if e["id"] not in used:
            report["removed"].append(f"{e['id']} ({e['name']})")
            (OUT_DIR / f"{e['id']}.webp").unlink(missing_ok=True)

    body = "\n".join(ts_entry(e) for e in out)
    (ROOT / "src/data/logbook" / f"{category}.ts").write_text(
        "// Generated by scripts/generate-logbook.py from the game files. Do not edit.\n"
        'import type { LogbookEntry } from "../types";\n\n'
        f"export const {EXPORT_NAME[category]}: LogbookEntry[] = [\n{body}\n];\n"
    )
    return len(out), report


def main():
    ap = argparse.ArgumentParser(description=__doc__.split("\n\n")[0])
    ap.add_argument("--game", type=Path, default=DEFAULT_GAME)
    ap.add_argument(
        "--only",
        default=",".join([*READERS, *EXTRA_GENERATORS]),
        help="comma-separated categories (default: all)",
    )
    args = ap.parse_args()

    game = Game(args.game)
    existing = load_entries()
    OUT_DIR.mkdir(parents=True, exist_ok=True)
    for category in args.only.split(","):
        print(f"Generating {category}…", file=sys.stderr)
        if category in EXTRA_GENERATORS:
            count, report = EXTRA_GENERATORS[category](game)
        else:
            count, report = generate(game, category, existing)
        print(f"\n{category}: {count} entries")
        for key, lines in report.items():
            if lines:
                print(f"  {key} ({len(lines)}):\n    " + "\n    ".join(lines))


if __name__ == "__main__":
    main()
