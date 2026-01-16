import { walkDirectory } from "./fs-utils";
import { readdir, writeFile, stat } from "node:fs/promises";
import { join } from "node:path";

const getAllDirectories = async (dir: string): Promise<string[]> => {
  const dirs: string[] = [];

  async function traverse(currentDir: string) {
    const entries = await readdir(currentDir, { withFileTypes: true });
    for (const entry of entries) {
      const fullPath = join(currentDir, entry.name);
      if (entry.isDirectory()) {
        dirs.push(fullPath);
        await traverse(fullPath);
      }
    }
  }

  await traverse(dir);
  return dirs;
};

const getSiblingTsFiles = async (dir: string): Promise<string[]> => {
  const entries = await readdir(dir, { withFileTypes: true });
  return entries
    .filter(
      (entry) =>
        entry.isFile() &&
        entry.name.endsWith(".ts") &&
        entry.name !== "index.ts",
    )
    .map((entry) => join(dir, entry.name));
};

const getSiblingDirectories = async (dir: string): Promise<string[]> => {
  const entries = await readdir(dir, { withFileTypes: true });
  return entries
    .filter((entry) => entry.isDirectory())
    .map((entry) => join(dir, entry.name));
};

const getDirectoryDepth = (path: string): number => {
  return path.split("/").length;
};

const normalizePath = (path: string): string => {
  return path.replace(/^\.\//, "");
};

const generateIndexFile = async (dir: string) => {
  const normalizedDir = normalizePath(dir);
  const tsFiles = await getSiblingTsFiles(dir);
  const subDirs = await getSiblingDirectories(dir);

  const exports: string[] = [];

  for (const file of tsFiles) {
    const normalizedFile = normalizePath(file);
    const relativePath = normalizedFile.replace(normalizedDir + "/", "");
    exports.push(`export * from './${relativePath.replace(".ts", "")}';`);
  }

  for (const subDir of subDirs) {
    const indexPath = join(subDir, "index.ts");
    try {
      await stat(indexPath);
      const normalizedSubDir = normalizePath(subDir);
      const relativePath = normalizedSubDir.replace(normalizedDir + "/", "");
      exports.push(`export * from './${relativePath}';`);
    } catch {}
  }

  if (exports.length === 0) {
    return;
  }

  const content = exports.join("\n");
  await writeFile(join(dir, "index.ts"), content);
};

export const barrelExporting = async () => {
  const directories = await getAllDirectories("./src/styles");

  const sortedDirs = directories.sort(
    (a, b) => getDirectoryDepth(b) - getDirectoryDepth(a),
  );

  for (const dir of sortedDirs) {
    await generateIndexFile(dir);
  }

  await generateIndexFile("./src/styles");
};
