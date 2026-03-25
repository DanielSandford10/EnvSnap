import fs from 'fs';
import path from 'path';

const ENV_PATTERNS = /^\.env(\..+)?$/;

export function findEnvFiles(dir: string): string[] {
  const files = fs.readdirSync(dir);
  return files.filter(f => ENV_PATTERNS.test(f) && fs.statSync(path.join(dir, f)).isFile());
}

export function readEnvFiles(dir: string, files: string[]): Record<string, string> {
  const result: Record<string, string> = {};
  for (const file of files) {
    result[file] = fs.readFileSync(path.join(dir, file), 'utf-8');
  }
  return result;
}

export function writeEnvFiles(dir: string, files: Record<string, string>): void {
  for (const [filename, contents] of Object.entries(files)) {
    fs.writeFileSync(path.join(dir, filename), contents, 'utf-8');
  }
}

export function defaultProjectName(dir: string): string {
  return path.basename(dir);
}

export function diffLines(a: string, b: string): { added: string[]; removed: string[]; unchanged: number } {
  const aLines = new Set(a.split('\n').filter(l => l.trim() && !l.startsWith('#')));
  const bLines = new Set(b.split('\n').filter(l => l.trim() && !l.startsWith('#')));

  const added: string[] = [];
  const removed: string[] = [];
  let unchanged = 0;

  for (const line of bLines) {
    if (aLines.has(line)) {
      unchanged++;
    } else {
      added.push(line);
    }
  }
  for (const line of aLines) {
    if (!bLines.has(line)) {
      removed.push(line);
    }
  }

  return { added, removed, unchanged };
}

export function maskValue(line: string): string {
  const match = line.match(/^([^=]+)=(.*)$/);
  if (!match) return line;
  const [, key, value] = match;
  if (!value) return line;
  return `${key}=****`;
}
