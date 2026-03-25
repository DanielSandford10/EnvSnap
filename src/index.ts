#!/usr/bin/env node

import { Command } from 'commander';
import { save } from './commands/save.js';
import { restore } from './commands/restore.js';
import { list } from './commands/list.js';
import { diff } from './commands/diff.js';
import { remove } from './commands/delete.js';

const program = new Command();

program
  .name('envsnap')
  .description('Snapshot and restore .env files across projects')
  .version('1.0.0');

program
  .command('save [name]')
  .description('Snapshot .env files in the current directory')
  .option('-f, --force', 'overwrite existing snapshot')
  .action(save);

program
  .command('restore [name]')
  .description('Restore .env files from a snapshot')
  .option('-y, --yes', 'skip confirmation prompt')
  .action(restore);

program
  .command('list')
  .alias('ls')
  .description('List all saved snapshots')
  .action(list);

program
  .command('diff [name]')
  .description('Show differences between current .env files and a snapshot')
  .action(diff);

program
  .command('delete <name>')
  .alias('rm')
  .description('Delete a snapshot')
  .action(remove);

program.parse();
