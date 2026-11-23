import { describe, test, expect } from 'vitest';
import { execa } from 'execa';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import genDiff from '../src/index.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const fixturesDir = path.join(__dirname, '..', '__fixtures__');

const filepath1 = path.join(fixturesDir, 'file1.json');
const filepath2 = path.join(fixturesDir, 'file2.json');
const filepath3 = path.join(fixturesDir, 'file3.json');
const filepath4 = path.join(fixturesDir, 'file4.json');
const ymlPath1 = path.join(fixturesDir, 'file1.yml');
const ymlPath2 = path.join(fixturesDir, 'file2.yml');
const ymlNested1 = path.join(fixturesDir, 'file3.yml');
const ymlNested2 = path.join(fixturesDir, 'file4.yml');

const expectedFlat = `{
  - follow: false
    host: hexlet.io
  - proxy: 123.234.53.22
  - timeout: 50
  + timeout: 20
  + verbose: true
}`;

const expectedNested = `{
    common: {
      + follow: false
        setting1: Value 1
      - setting2: 200
      - setting3: true
      + setting3: null
      + setting4: blah blah
      + setting5: {
            key5: value5
        }
        setting6: {
            doge: {
              - wow: 
              + wow: so much
            }
            key: value
          + ops: vops
        }
    }
    group1: {
      - baz: bas
      + baz: bars
        foo: bar
      - nest: {
            key: value
        }
      + nest: str
    }
  - group2: {
        abc: 12345
        deep: {
            id: 45
        }
    }
  + group3: {
        deep: {
            id: {
                number: 45
            }
        }
        fee: 100500
    }
}`;

describe('genDiff', () => {
  test('compares flat JSON files', () => {
    expect(genDiff(filepath1, filepath2)).toBe(expectedFlat);
  });

  test('compares nested JSON files', () => {
    expect(genDiff(filepath3, filepath4)).toBe(expectedNested);
  });

  test('compares flat YAML files', () => {
    expect(genDiff(ymlPath1, ymlPath2)).toBe(expectedFlat);
  });

  test('compares JSON and YAML mixed (flat)', () => {
    expect(genDiff(filepath1, ymlPath2)).toBe(expectedFlat);
  });

  test('compares nested YAML files', () => {
    expect(genDiff(ymlNested1, ymlNested2)).toBe(expectedNested);
  });

  test('compares nested JSON and YAML mixed', () => {
    expect(genDiff(filepath3, ymlNested2)).toBe(expectedNested);
  });
});

describe('gendiff CLI (diff)', () => {
  test('outputs diff between flat JSON files', async () => {
    const { stdout } = await execa('node', ['bin/gendiff.js', filepath1, filepath2]);
    expect(stdout).toBe(expectedFlat);
  });
});

const expectedPlainNested = [
  "Property 'common.follow' was added with value: false",
  "Property 'common.setting2' was removed",
  "Property 'common.setting3' was updated. From true to null",
  "Property 'common.setting4' was added with value: 'blah blah'",
  "Property 'common.setting5' was added with value: [complex value]",
  "Property 'common.setting6.doge.wow' was updated. From '' to 'so much'",
  "Property 'common.setting6.ops' was added with value: 'vops'",
  "Property 'group1.baz' was updated. From 'bas' to 'bars'",
  "Property 'group1.nest' was updated. From [complex value] to 'str'",
  "Property 'group2' was removed",
  "Property 'group3' was added with value: [complex value]",
].join('\n');

const expectedPlainFlat = [
  "Property 'follow' was removed",
  "Property 'proxy' was removed",
  "Property 'timeout' was updated. From 50 to 20",
  "Property 'verbose' was added with value: true",
].join('\n');

describe('plain formatter', () => {
  test('renders nested diff as plain text', () => {
    expect(genDiff(filepath3, filepath4, 'plain')).toBe(expectedPlainNested);
  });

  test('renders flat diff as plain text', () => {
    expect(genDiff(filepath1, filepath2, 'plain')).toBe(expectedPlainFlat);
  });

  test('renders nested YAML diff as plain text', () => {
    expect(genDiff(ymlNested1, ymlNested2, 'plain')).toBe(expectedPlainNested);
  });
});

describe('gendiff CLI (plain)', () => {
  test('outputs plain diff', async () => {
    const { stdout } = await execa('node', [
      'bin/gendiff.js', '-f', 'plain', filepath3, filepath4,
    ]);
    expect(stdout).toBe(expectedPlainNested);
  });
});

describe('json formatter', () => {
  test('renders nested diff as valid JSON', () => {
    const result = genDiff(filepath3, filepath4, 'json');
    const parsed = JSON.parse(result);

    expect(parsed).toEqual([
      {
        key: 'common',
        type: 'nested',
        children: [
          { key: 'follow', type: 'added', value: false },
          { key: 'setting1', type: 'unchanged', value: 'Value 1' },
          { key: 'setting2', type: 'removed', value: 200 },
          { key: 'setting3', type: 'changed', value: null, oldValue: true },
          { key: 'setting4', type: 'added', value: 'blah blah' },
          {
            key: 'setting5',
            type: 'added',
            value: { key5: 'value5' },
          },
          {
            key: 'setting6',
            type: 'nested',
            children: [
              {
                key: 'doge',
                type: 'nested',
                children: [
                  { key: 'wow', type: 'changed', value: 'so much', oldValue: '' },
                ],
              },
              { key: 'key', type: 'unchanged', value: 'value' },
              { key: 'ops', type: 'added', value: 'vops' },
            ],
          },
        ],
      },
      {
        key: 'group1',
        type: 'nested',
        children: [
          { key: 'baz', type: 'changed', value: 'bars', oldValue: 'bas' },
          { key: 'foo', type: 'unchanged', value: 'bar' },
          {
            key: 'nest',
            type: 'changed',
            value: 'str',
            oldValue: { key: 'value' },
          },
        ],
      },
      {
        key: 'group2',
        type: 'removed',
        value: { abc: 12345, deep: { id: 45 } },
      },
      {
        key: 'group3',
        type: 'added',
        value: { deep: { id: { number: 45 } }, fee: 100500 },
      },
    ]);
  });

  test('renders flat diff as valid JSON', () => {
    const result = genDiff(filepath1, filepath2, 'json');
    const parsed = JSON.parse(result);

    expect(parsed).toEqual([
      { key: 'follow', type: 'removed', value: false },
      { key: 'host', type: 'unchanged', value: 'hexlet.io' },
      { key: 'proxy', type: 'removed', value: '123.234.53.22' },
      { key: 'timeout', type: 'changed', value: 20, oldValue: 50 },
      { key: 'verbose', type: 'added', value: true },
    ]);
  });

  test('output is parseable and pretty-printed', () => {
    const result = genDiff(filepath1, filepath2, 'json');
    expect(() => JSON.parse(result)).not.toThrow();
    expect(result).toContain('\n');
    expect(result).toContain('  ');
  });
});

describe('gendiff CLI (json)', () => {
  test('outputs valid JSON via --format json', async () => {
    const { stdout } = await execa('node', [
      'bin/gendiff.js', '--format', 'json', filepath1, filepath2,
    ]);
    expect(() => JSON.parse(stdout)).not.toThrow();
  });
});
