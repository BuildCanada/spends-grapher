const splitLines = (content: string): string[] => {
  return content.split("\n");
};

const isColor = (line: string): boolean => {
  return line.includes("--color");
};

type ColorKV = {
  key: string;
  value: string;
};

const splitKv = (line: string): ColorKV => {
  let [key, value] = line.split(":");
  if (!key || !value) throw new Error("line is not color, use isColor");
  key = key.trim();
  value = value.trim();
  key = key.slice(8);
  value = value.slice(0, -1);
  return { key, value };
};

export const linesToKV = (content: string) => {
  const lines = splitLines(content).filter((line) => isColor(line));
  const kvs = lines.map(splitKv);
  return kvs;
};

const kebabToSnake = (item: string): string => {
  return item.replaceAll("-", "_");
};

export const kvToColourFile = (content: ColorKV[], cssName: string): string => {
  const colorName = kebabToSnake(cssName.split(".")[0]!);
  let payload = `export const ${colorName} = {\n`;
  content.forEach((item, index) => {
    const key = item.key.split("-")[1]!;
    const separator = index === content.length - 1 ? "" : ",";
    payload += `\t"${key}":"${item.value}"${separator}\n`;
  });
  payload += `};`;
  return payload;
};

export const kvToChartFile = (content: ColorKV[], cssName: string): string => {
  const colorName = kebabToSnake(cssName.split(".")[0]!);
  let payload = `export const ${colorName} = [\n`;
  content.forEach((item) => {
    payload += `\t"${item.value}",\n`;
  });
  payload += `];`;
  return payload;
};
