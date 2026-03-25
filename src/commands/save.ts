import chalk from 'chalk';
import path from 'path';
import { saveSnapshot, snapshotExists } from '../storage.js';
import { findEnvFiles, readEnvFiles, defaultProjectName } from '../utils.js';

interface SaveOptions {
  force?: boolean;
}

export async function save(name: string | undefined, options: SaveOptions): Promise<void> {
  const cwd = process.cwd();
  const projectName = defaultProjectName(cwd);
  const snapshotName = name ?? projectName;

  const envFiles = findEnvFiles(cwd);

  if (envFiles.length === 0) {
    console.log(chalk.yellow('No .env files found in current directory.'));
    process.exit(1);
  }

  if (snapshotExists(snapshotName) && !options.force) {
    console.log(chalk.yellow(`Snapshot "${snapshotName}" already exists. Use --force to overwrite.`));
    process.exit(1);
  }

  const files = readEnvFiles(cwd, envFiles);

  saveSnapshot({
    name: snapshotName,
    project: path.basename(cwd),
    createdAt: new Date().toISOString(),
    files,
  });

  console.log(chalk.green(`Snapshot "${snapshotName}" saved.`));
  for (const f of envFiles) {
    console.log(chalk.dim(`  ${f}`));
  }
}
