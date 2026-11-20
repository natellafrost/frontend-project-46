import { describe, it, expect } from 'vitest';
import path from 'path';
import { fileURLToPath } from 'url';
import { execa } from 'execa';
import genDiff from '../src/index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const getFilepath = (filename) => path.join(__dirname, '..', '__fixtures__', filename);

describe('gendiff CLI', () => {
  it('shows usage with --help', async () => {
    const { stdout } = await execa('node', ['bin/gendiff.js', '--help']);
    expect(stdout).toContain('Usage: gendiff');
  });

  it('shows version with -V', async () => {
    const { stdout } = await execa('node', ['bin/gendiff.js', '-V']);
    expect(stdout).toMatch(/\d+\.\d+\.\d+/);
  });
});

describe('gendiff flat json', () => {
  it('should return correct diff for flat json files', () => {
    const filepath1 = getFilepath('file1.json');
    const filepath2 = getFilepath('file2.json');

    const result = genDiff(filepath1, filepath2);

    // Проверяем наличие ключевых элементов вывода на основе реальных фикстур
    expect(result).toContain('host: hexlet.io'); // Неизмененное значение
    expect(result).toContain('- follow: false'); // Удалено
    expect(result).toContain('- proxy: 123.234.53.22'); // Удалено
    expect(result).toContain('- timeout: 50'); // Изменено (старое значение)
    expect(result).toContain('+ timeout: 20'); // Изменено (новое значение)
    expect(result).toContain('+ verbose: true'); // Добавлено

    // Проверка сортировки по алфавиту: follow -> host -> proxy -> timeout -> verbose
    const indexFollow = result.indexOf('follow');
    const indexHost = result.indexOf('host');
    const indexProxy = result.indexOf('proxy');
    const indexTimeout = result.indexOf('timeout');
    const indexVerbose = result.indexOf('verbose');

    expect(indexFollow).toBeLessThan(indexHost);
    expect(indexHost).toBeLessThan(indexProxy);
    expect(indexProxy).toBeLessThan(indexTimeout);
    expect(indexTimeout).toBeLessThan(indexVerbose);
  });
});
