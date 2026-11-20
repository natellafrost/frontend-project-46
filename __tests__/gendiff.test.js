import { describe, test, expect } from 'vitest';
import { execa } from 'execa';

describe('gendiff CLI', () => {
  test('shows usage with --help', async () => {
    const { stdout } = await execa('node', ['bin/gendiff.js', '--help']);
    expect(stdout).toContain('Usage: gendiff');
  });

  test('shows version with -V', async () => {
    const { stdout } = await execa('node', ['bin/gendiff.js', '-V']);
    expect(stdout).toMatch(/\d+\.\d+\.\d+/);
  });
});
