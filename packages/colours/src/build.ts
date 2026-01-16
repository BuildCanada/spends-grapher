import { cssToTs } from "./lib/cssToTs";
import { barrelExporting } from "./lib/barrelExporting";
import { mkdir, cp } from "node:fs/promises";
import { spawn } from "node:child_process";

const build = async () => {
  console.log("Converting CSS to TS...");
  await cssToTs();

  console.log("Generating barrel exports...");
  await barrelExporting();

  console.log("Copying styles to dist...");
  await mkdir("dist", { recursive: true });
  await cp("src/styles", "dist/styles", { recursive: true });

  console.log("Compiling TypeScript to JavaScript...");
  await new Promise<void>((resolve, reject) => {
    const tsc = spawn("npx", ["tsc", "--project", "tsconfig.build.json"], {
      stdio: "inherit"
    });
    tsc.on("close", (code) => {
      if (code === 0) resolve();
      else reject(new Error(`tsc exited with code ${code}`));
    });
  });

  console.log("Build complete!");
};

build();
