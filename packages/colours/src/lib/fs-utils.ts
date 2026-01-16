import {
  readdir,
  readFile,
  writeFile,
  mkdir,
  stat,
} from "node:fs/promises";
import { cwd } from "node:process";
import { dirname, join } from "node:path";

export async function walkDirectory(target: string): Promise<string[]> {
  const files: string[] = [];

  async function traverse(dir: string) {
    const entries = await readdir(dir, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = join(dir, entry.name);
      const entryStat = await stat(fullPath);

      if (entryStat.isDirectory()) {
        await traverse(fullPath);
      } else {
        files.push(fullPath);
      }
    }
  }

  await traverse(target);
  return files;
}

export async function getFile(target: string): Promise<string> {
  const result = await readFile(target, "utf-8");
  return result;
}

async function getFiles(targets: string[]): Promise<string[]> {
  return await Promise.all(
    targets.map(async (target) => {
      return await getFile(target);
    }),
  );
}

const getFileName = (path: string): string => {
  const routeParts = path.split("/");
  if (!routeParts) throw new Error("Not a path");
  const fileName = routeParts.pop();
  if (!fileName) throw new Error("What is the point of pop anyway");
  return fileName;
};

type MetaData = {
  cssPath: string;
  cssName: string;
  tsName: string;
  tsPath: string;
};

export const getMetaData = (path: string): MetaData => {
  const cssName = getFileName(path);
  const tsName = [cssName.split(".")[0]!, ".ts"].join("");
  const tsPath = join(dirname(path), tsName);
  return {
    cssPath: path,
    cssName,
    tsPath,
    tsName,
  };
};
