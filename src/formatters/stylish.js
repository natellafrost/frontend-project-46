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
  const indent = INDENT.repeat(depth);
  const { key, type } = node;

  switch (type) {
    case 'nested':
      return `${indent}${key}: {\n${node.children.map((child) => renderNode(child, depth + 1)).join('\n')}\n${indent}}`;
    case 'added':
      return `${indent}  + ${key}: ${stringify(node.value, depth + 1)}`;
    case 'removed':
      return `${indent}  - ${key}: ${stringify(node.value, depth + 1)}`;
    case 'changed':
      return `${indent}  - ${key}: ${stringify(node.oldValue, depth + 1)}\n${indent}  + ${key}: ${stringify(node.value, depth + 1)}`;
    case 'unchanged':
    default:
      return `${indent}    ${key}: ${stringify(node.value, depth + 1)}`;
  }
};

const stylish = (diffTree) => {
  const lines = diffTree.map((node) => renderNode(node, 0));
  return `{\n${lines.join('\n')}\n}`;
};

export default stylish;
