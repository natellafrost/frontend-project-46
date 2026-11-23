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
