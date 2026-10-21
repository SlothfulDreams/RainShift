import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { KEEPER_PATH, type Marks, publishIcons } from "../publish";

// Dev-only: saving a config publishes it everywhere it's used.
const RAIL_PATH = "src/app/lab/icon/saved.json";

const devOnly = () => process.env.NODE_ENV !== "development";

async function readJson<T>(file: string, fallback: T): Promise<T> {
  try {
    return JSON.parse(await readFile(path.join(process.cwd(), file), "utf8"));
  } catch {
    return fallback;
  }
}

export async function GET() {
  if (devOnly()) return new Response(null, { status: 404 });
  return Response.json({ saved: await readJson(RAIL_PATH, []) });
}

export async function POST(request: Request) {
  if (devOnly()) return new Response(null, { status: 404 });
  const { target, config } = await request.json();
  if (
    (target !== "favicon" && target !== "header") ||
    typeof config?.artDove !== "string"
  ) {
    return Response.json(
      { error: "Expected { target, config }" },
      { status: 400 },
    );
  }
  const marks = await readJson<Marks>(KEEPER_PATH, {} as Marks);
  const written = await publishIcons({ ...marks, [target]: config });
  const saved = [...(await readJson<unknown[]>(RAIL_PATH, [])), config].slice(
    -24,
  );
  await writeFile(
    path.join(process.cwd(), RAIL_PATH),
    `${JSON.stringify(saved, null, 2)}\n`,
  );
  return Response.json({ written, saved });
}
