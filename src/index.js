import { readFileSync } from 'node:fs';

const readAndParse = (filepath) => JSON.parse(readFileSync(filepath, 'utf-8'));

const genDiff = (filepath1, filepath2) => {
  const data1 = readAndParse(filepath1);
  const data2 = readAndParse(filepath2);

  const allKeys = [...new Set([...Object.keys(data1), ...Object.keys(data2)])];
  const sortedKeys = allKeys.sort();

  const lines = sortedKeys.map((key) => {
    const inFirst = Object.hasOwn(data1, key);
    const inSecond = Object.hasOwn(data2, key);

    if (!inSecond) {
      return `  - ${key}: ${data1[key]}`;
    }
    if (!inFirst) {
      return `  + ${key}: ${data2[key]}`;
    }
    if (data1[key] !== data2[key]) {
      return `  - ${key}: ${data1[key]}\n  + ${key}: ${data2[key]}`;
    }
    return `    ${key}: ${data1[key]}`;
  });

  return `{\n${lines.join('\n')}\n}`;
};

export default genDiff;
