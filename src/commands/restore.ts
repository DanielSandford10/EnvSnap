import chalk from 'chalk';
import path from 'path';
import readline from 'readline';
import { loadSnapshot } from '../storage.js';
import { writeEnvFiles, defaultProjectName, findEnvFiles } from '../utils.js';

interface RestoreOptions {
  yes?: boolean;
}

function prompt(question: string): Promise<string> {
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  return new Promise(resolve => {
    rl.question(question, answer => {
      rl.close();
      resolve(answer);
    });
  });
}

export async function restore(name: string | undefined, options: RestoreOptions): Promise<void> {
  const cwd = process.cwd();
  const snapshotName = name ?? defaultProjectName(cwd);
  const snapshot = loadSnapshot(snapshotName);

  if (!snapshot) {
    console.log(chalk.red(`Snapshot "${snapshotName}" not found.`));
    process.exit(1);
  }

  const restoredFiles = Object.keys(snapshot.files);
  const existing = findEnvFiles(cwd);

  console.log(chalk.bold(`Restoring snapshot: ${snapshotName}`));
  console.log(chalk.dim(`  Saved: ${new Date(snapshot.createdAt).toLocaleString()}`));
  console.log(chalk.dim(`  Files: ${restoredFiles.join(', ')}`));

  if (existing.length > 0 && !options.yes) {
    const answer = await prompt(
      chalk.yellow(`\nThis will overwrite: ${existing.join(', ')}\nProceed? (y/N) `)
    );
    if (answer.toLowerCase() !== 'y') {
      console.log(chalk.dim('Aborted.'));
      return;
    }
  }

  writeEnvFiles(cwd, snapshot.files);

  console.log(chalk.green('\nRestored successfully.'));
  for (const f of restoredFiles) {
    console.log(chalk.dim(`  ${f}`));
  }
}
