import parse from './parser.js';
import buildDiff from './buildDiff.js';
import stylish from './formatters/stylish.js';

const formatters = {
  stylish,
};

const genDiff = (filepath1, filepath2, format = 'stylish') => {
  const data1 = parse(filepath1);
  const data2 = parse(filepath2);

  const diffTree = buildDiff(data1, data2);

  const formatter = formatters[format];
  if (!formatter) {
    throw new Error(`Unknown format: ${format}`);
  }

  return formatter(diffTree);
};

export default genDiff;
