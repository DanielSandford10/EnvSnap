import chalk from 'chalk';
import { getIndex } from '../storage.js';

export function list(): void {
  const index = getIndex();

  if (index.snapshots.length === 0) {
    console.log(chalk.dim('No snapshots saved yet. Run `envsnap save` to create one.'));
    return;
  }

  console.log(chalk.bold(`\n${index.snapshots.length} snapshot(s)\n`));

  for (const s of index.snapshots) {
    const date = new Date(s.createdAt).toLocaleString();
    console.log(`  ${chalk.cyan(s.name.padEnd(30))} ${chalk.dim(`${s.fileCount} file(s)  ${date}`)}`);
  }

  console.log('');
}
