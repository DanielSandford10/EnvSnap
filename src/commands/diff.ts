import chalk from 'chalk';
import { loadSnapshot } from '../storage.js';
import { findEnvFiles, readEnvFiles, diffLines, maskValue, defaultProjectName } from '../utils.js';

export function diff(name: string | undefined): void {
  const cwd = process.cwd();
  const snapshotName = name ?? defaultProjectName(cwd);
  const snapshot = loadSnapshot(snapshotName);

  if (!snapshot) {
    console.log(chalk.red(`Snapshot "${snapshotName}" not found.`));
    process.exit(1);
  }

  const currentFiles = findEnvFiles(cwd);
  const current = readEnvFiles(cwd, currentFiles);

  const allFiles = new Set([...Object.keys(snapshot.files), ...Object.keys(current)]);
  let anyDiff = false;

  for (const file of allFiles) {
    const inSnapshot = file in snapshot.files;
    const inCurrent = file in current;

    if (!inSnapshot) {
      console.log(chalk.green(`+ ${file}`) + chalk.dim(' (new, not in snapshot)'));
      anyDiff = true;
      continue;
    }

    if (!inCurrent) {
      console.log(chalk.red(`- ${file}`) + chalk.dim(' (missing, exists in snapshot)'));
      anyDiff = true;
      continue;
    }

    const { added, removed } = diffLines(snapshot.files[file], current[file]);

    if (added.length === 0 && removed.length === 0) {
      console.log(chalk.dim(`  ${file}  (unchanged)`));
      continue;
    }

    anyDiff = true;
    console.log(chalk.bold(`\n  ${file}`));
    for (const line of removed) {
      console.log(chalk.red(`  - ${maskValue(line)}`));
    }
    for (const line of added) {
      console.log(chalk.green(`  + ${maskValue(line)}`));
    }
  }

  if (!anyDiff) {
    console.log(chalk.dim('No differences found.'));
  }
}
