const stringifyValue = (value) => {
  if (value === null) {
    return 'null';
  }
  if (typeof value === 'string') {
    return `'${value}'`;
  }
  if (typeof value === 'object') {
    return '[complex value]';
  }
  return String(value);
};

const plain = (diffTree) => {
  const render = (nodes, parentPath = '') => {
    const lines = nodes
      .filter((node) => node.type !== 'unchanged')
      .map((node) => {
        const path = parentPath ? `${parentPath}.${node.key}` : node.key;

        switch (node.type) {
          case 'nested':
            return render(node.children, path);
          case 'added':
            return `Property '${path}' was added with value: ${stringifyValue(node.value)}`;
          case 'removed':
            return `Property '${path}' was removed`;
          case 'changed':
            return `Property '${path}' was updated. From ${stringifyValue(node.oldValue)} to ${stringifyValue(node.value)}`;
          default:
            return '';
        }
      })
      .filter((line) => line !== '');

    return lines.join('\n');
  };

  return render(diffTree);
};

export default plain;
