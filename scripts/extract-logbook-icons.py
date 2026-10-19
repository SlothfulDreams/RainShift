#!/usr/bin/env python3
# /// script
# requires-python = ">=3.10"
# dependencies = ["UnityPy>=1.25", "pillow"]
# ///
"""
Extract logbook icons from a local Risk of Rain 2 install.

Reads each logbook entry from src/data/logbook-entries.ts, finds the matching
game definition (ItemDef, EquipmentDef, CharacterBody, SceneDef) in the
Addressables bundles, and writes its icon to public/logbook/<entry-id>.webp.

Usage:
  uv run scripts/extract-logbook-icons.py [--game "<path to Risk of Rain 2>"]
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
        return (
            ids[entries[i][0]].split("\\")[-1]
            if ids[entries[i][0]].endswith(".bundle")
            else ids[entries[i][0]]
        )

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
    return re.sub(r"<[^>]+>", "", s or "").strip().lower()


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


# ---------------------------------------------------------------------------
# Indexes: name -> icon loader
# ---------------------------------------------------------------------------


def index_pickups(game: Game, type_name: str):
    """ItemDef / EquipmentDef: internal name and English name -> icon."""
    by_name, by_display = {}, {}
    for path in game.paths_of_type(type_name):
        stem = Path(path).stem
        for obj, t in game.defs_of(path):
            if t.get("m_Name") != stem or "pickupIconSprite" not in t:
                continue

            def load(obj=obj, t=t):
                return game.image_from_reference(
                    t.get("pickupIconSpriteReference")
                ) or game.image_from_pptr(obj, t.get("pickupIconSprite"))

            by_name[stem.lower()] = load
            by_display.setdefault(clean(game.english.get(t.get("nameToken"))), load)
    return by_name, by_display


def index_scenes(game: Game):
    by_name, by_display = {}, {}
    for path in game.paths_of_type("SceneDef"):
        for obj, t in game.defs_of(path):
            if "previewTexture" not in t:
                continue

            def load(obj=obj, t=t):
                return game.image_from_reference(
                    t.get("previewTextureReference")
                ) or game.image_from_pptr(obj, t.get("previewTexture"))

            by_name[(t.get("m_Name") or "").lower()] = load
            # Variants (e.g. blackbeach2) override the base scene name; don't
            # let them replace the base scene's own definition.
            by_name.setdefault((t.get("baseSceneNameOverride") or "").lower(), load)
            by_display.setdefault(clean(game.english.get(t.get("nameToken"))), load)
    return by_name, by_display


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


def index_bodies(game: Game):
    """
    Character bodies by their log unlockable (DeathRewards.logUnlockableDef),
    prefab name and English name -> body prefab name.
    """
    by_log, by_name, by_display = {}, {}, {}
    for body in game.prefabs:
        if not body.endswith("Body"):
            continue
        for obj, t in game.components_of(body):
            if "baseNameToken" in t and "portraitIcon" in t:
                by_name[body.lower()] = body
                display = clean(game.english.get(t["baseNameToken"]))
                if display:
                    by_display.setdefault(display, body)
            elif "logUnlockableDef" in t:
                log = game.deref(obj, t["logUnlockableDef"])
                if log:
                    by_log.setdefault(log.read_typetree()["m_Name"], body)
    return by_log, by_name, by_display


def index_drones(game: Game):
    """DroneDef: body prefab name and English name -> icon."""
    by_body, by_display = {}, {}
    for path in game.paths_of_type("DroneDef"):
        for obj, t in game.defs_of(path):
            if "bodyPrefab" not in t or "iconSprite" not in t:
                continue

            def load(obj=obj, t=t):
                return (
                    game.image_from_reference(t.get("iconSpriteReference"))
                    or game.image_from_pptr(obj, t.get("iconSprite"))
                    or game.image_from_pptr(obj, t.get("iconTexture"))
                )

            body = game.deref(obj, t["bodyPrefab"])
            if body:
                by_body[body.read().m_Name.lower()] = load
            by_display.setdefault(clean(game.english.get(t.get("nameToken"))), load)
    return by_body, by_display


# ---------------------------------------------------------------------------
# Main
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


def save_icon(img: Image.Image, entry_id: str):
    img = img.convert("RGBA")
    img.thumbnail((ICON_SIZE, ICON_SIZE), Image.LANCZOS)
    buf = io.BytesIO()
    img.save(buf, "WEBP", quality=80, method=6)
    (OUT_DIR / f"{entry_id}.webp").write_bytes(buf.getvalue())


def main():
    ap = argparse.ArgumentParser(description=__doc__.split("\n\n")[0])
    ap.add_argument("--game", type=Path, default=DEFAULT_GAME)
    args = ap.parse_args()

    game = Game(args.game)
    entries = load_entries()
    OUT_DIR.mkdir(parents=True, exist_ok=True)

    print("Indexing items, equipment and stages…", file=sys.stderr)
    items = index_pickups(game, "ItemDef")
    equipment = index_pickups(game, "EquipmentDef")
    scenes = index_scenes(game)
    drones = index_drones(game)
    print("Indexing character bodies…", file=sys.stderr)
    bodies = index_bodies(game)

    missing = []
    for e in entries:
        cat, name = e["category"], clean(e["name"])
        loader = None
        if cat in ("items", "equipment"):
            by_name, by_display = items if cat == "items" else equipment
            key = (e.get("pickupId") or "").split(".", 1)[-1].lower()
            loader = by_name.get(key) or by_display.get(name)
        elif cat == "environments":
            by_name, by_display = scenes
            key = e["unlockId"].removeprefix("Logs.Stages.").lower()
            loader = by_name.get(key) or by_display.get(name)
        elif cat == "drones":
            by_body, by_display = drones
            body = re.sub(r"\.0$", "", e["unlockId"].removeprefix("Logs.")).lower()
            loader = by_body.get(body) or by_display.get(name)
        else:  # monsters, survivors
            by_log, by_name, by_display = bodies
            guess = re.sub(r"\.0$", "", e["unlockId"].removeprefix("Logs.")).lower()
            body = (
                by_log.get(e["unlockId"]) or by_name.get(guess) or by_display.get(name)
            )
            loader = (lambda body=body: body_icon(game, body)) if body else None

        img = loader() if loader else None
        if img is None:
            missing.append(f"{cat}: {e['id']} ({e['name']})")
            continue
        save_icon(img, e["id"])

    print(f"Wrote {len(entries) - len(missing)}/{len(entries)} icons to {OUT_DIR}")
    if missing:
        print("No icon found for:\n  " + "\n  ".join(missing))
        sys.exit(1)


if __name__ == "__main__":
    main()
