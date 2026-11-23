const INDENT = '    ';

const stringify = (value, depth) => {
  if (value === null || typeof value !== 'object') {
    return String(value);
  }

  const indent = INDENT.repeat(depth + 1);
  const closingIndent = INDENT.repeat(depth);
  const entries = Object.entries(value).map(
    ([key, val]) => `${indent}${key}: ${stringify(val, depth + 1)}`,
  );

  return `{\n${entries.join('\n')}\n${closingIndent}}`;
};

const renderNode = (node, depth) => {
  const { key, type } = node;
  const baseIndent = INDENT.repeat(depth);
  const signIndent = INDENT.repeat(depth).slice(2);

  switch (type) {
    case 'nested':
      return `${baseIndent}${key}: {\n${node.children
        .map((child) => renderNode(child, depth + 1))
        .join('\n')}\n${baseIndent}}`;
    case 'added':
      return `${signIndent}+ ${key}: ${stringify(node.value, depth)}`;
    case 'removed':
      return `${signIndent}- ${key}: ${stringify(node.value, depth)}`;
    case 'changed':
      return `${signIndent}- ${key}: ${stringify(node.oldValue, depth)}\n${signIndent}+ ${key}: ${stringify(node.value, depth)}`;
    case 'unchanged':
    default:
      return `${baseIndent}${key}: ${stringify(node.value, depth)}`;
  }
};

const stylish = (diffTree) => {
  const lines = diffTree.map((node) => renderNode(node, 1));
  return `{\n${lines.join('\n')}\n}`;
};

export default stylish;
