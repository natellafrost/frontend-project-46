import { readFileSync } from 'node:fs';
import path from 'node:path';
import { load } from 'js-yaml';

const parsers = {
  '.json': JSON.parse,
  '.yaml': load,
  '.yml': load,
};

const parse = (filepath) => {
  const absolutePath = path.resolve(filepath);
  const extension = path.extname(absolutePath);
  const parser = parsers[extension];

  if (!parser) {
    throw new Error(`Unsupported file format: ${extension}`);
  }

  const content = readFileSync(absolutePath, 'utf-8');
  return parser(content);
};

export default parse;
