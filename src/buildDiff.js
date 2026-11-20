const isObject = (value) => value !== null && typeof value === 'object' && !Array.isArray(value);

const buildDiff = (data1, data2) => {
  const allKeys = [...new Set([...Object.keys(data1), ...Object.keys(data2)])].sort();

  return allKeys.map((key) => {
    const inFirst = Object.hasOwn(data1, key);
    const inSecond = Object.hasOwn(data2, key);

    if (!inSecond) {
      return { key, type: 'removed', value: data1[key] };
    }
    if (!inFirst) {
      return { key, type: 'added', value: data2[key] };
    }

    const value1 = data1[key];
    const value2 = data2[key];

    if (isObject(value1) && isObject(value2)) {
      return { key, type: 'nested', children: buildDiff(value1, value2) };
    }
    if (value1 === value2) {
      return { key, type: 'unchanged', value: value1 };
    }
    return { key, type: 'changed', value: value2, oldValue: value1 };
  });
};

export default buildDiff;
