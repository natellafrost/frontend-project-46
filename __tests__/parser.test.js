import { describe, test, expect } from 'vitest';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import parse from '../src/parser.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const fixturesDir = path.join(__dirname, '..', '__fixtures__');
const filepath1 = path.join(fixturesDir, 'file1.json');

describe('parse', () => {
  test('parses JSON file by absolute path', () => {
    expect(parse(filepath1)).toEqual({
      host: 'hexlet.io',
      timeout: 50,
      proxy: '123.234.53.22',
      follow: false,
    });
  });

  test('parses JSON file by relative path', () => {
    expect(parse('__fixtures__/file1.json')).toEqual({
      host: 'hexlet.io',
      timeout: 50,
      proxy: '123.234.53.22',
      follow: false,
    });
  });

  test('throws on unsupported format', () => {
    expect(() => parse('__fixtures__/file1.txt')).toThrow();
  });
});
