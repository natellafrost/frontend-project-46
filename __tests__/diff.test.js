import { describe, test, expect } from 'vitest';
import { execa } from 'execa';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import genDiff from '../src/index.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const fixturesDir = path.join(__dirname, '..', '__fixtures__');
const filepath1 = path.join(fixturesDir, 'file1.json');
const filepath2 = path.join(fixturesDir, 'file2.json');

const expected = `{
  - follow: false
    host: hexlet.io
  - proxy: 123.234.53.22
  - timeout: 50
  + timeout: 20
  + verbose: true
}`;

describe('genDiff', () => {
  test('compares flat JSON files', () => {
    expect(genDiff(filepath1, filepath2)).toBe(expected);
  });
});

describe('gendiff CLI (diff)', () => {
  test('outputs diff between flat JSON files', async () => {
    const { stdout } = await execa('node', ['bin/gendiff.js', filepath1, filepath2]);
    expect(stdout).toBe(expected);
  });
});

const ymlPath1 = path.join(fixturesDir, 'file1.yml');
const ymlPath2 = path.join(fixturesDir, 'file2.yml');

test('compares flat YAML files', () => {
  expect(genDiff(ymlPath1, ymlPath2)).toBe(expected);
});

test('compares JSON and YAML mixed', () => {
  expect(genDiff(filepath1, ymlPath2)).toBe(expected);
});
