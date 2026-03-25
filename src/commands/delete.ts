import chalk from 'chalk';
import { deleteSnapshot, snapshotExists } from '../storage.js';

export function remove(name: string): void {
  if (!snapshotExists(name)) {
    console.log(chalk.red(`Snapshot "${name}" not found.`));
    process.exit(1);
  }

  deleteSnapshot(name);
  console.log(chalk.green(`Snapshot "${name}" deleted.`));
}
