import { cwd } from "node:process";
import { join } from "node:path";
import { writeFile } from "node:fs/promises";
import { walkDirectory, getFile, getMetaData } from "./fs-utils";
import { linesToKV, kvToChartFile, kvToColourFile } from "./syntax-utils";

const getCssStylePaths = async () => {
  const stylesPath = join(cwd(), "src", "styles");
  const paths = await walkDirectory(stylesPath);
  return paths.filter((path) => path.endsWith(".css"));
};

export const cssToTs = async () => {
  const paths = await getCssStylePaths();

  await Promise.all(
    paths.map(async (path) => {
      const file = await getFile(path);
      const kv = linesToKV(file);
      const metaData = getMetaData(path);
      if (path.includes("/styles/colours")) {
        const colorFile = kvToColourFile(kv, metaData.cssName);
        await writeFile(join(metaData.tsPath), colorFile, "utf-8");
      }
      if (path.includes("/styles/themes/charts")) {
        const chartFile = kvToChartFile(kv, metaData.cssName);
        await writeFile(join(metaData.tsPath), chartFile, "utf-8");
      }
    })
  );
};
