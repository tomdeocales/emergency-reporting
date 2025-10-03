import { readFile } from "node:fs/promises";
import { join } from "node:path";

export async function loadStaticJson<T>(relativePath: string): Promise<T> {
  const path = join(process.cwd(), "public", relativePath);
  const file = await readFile(path, "utf-8");
  return JSON.parse(file) as T;
}
