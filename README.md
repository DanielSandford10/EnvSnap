# EnvSnap

A command-line tool to snapshot and restore `.env` files across your projects.

Never lose a working environment config again.

## Install

```bash
npm install -g envsnap
```

Or run directly with npx:

```bash
npx envsnap save
```

## Usage

### Save a snapshot

```bash
cd my-project
envsnap save
# Saves as "my-project" by default

envsnap save staging
# Saves with a custom name
```

### Restore a snapshot

```bash
envsnap restore
# Restores snapshot named after current directory

envsnap restore staging
# Restores a named snapshot

envsnap restore staging --yes
# Skip confirmation prompt
```

### List snapshots

```bash
envsnap list
```

```
3 snapshot(s)

  my-project                     2 file(s)  3/25/2026, 10:00:00 AM
  my-project-staging             1 file(s)  3/24/2026, 5:00:00 PM
  other-project                  3 file(s)  3/20/2026, 9:00:00 AM
```

### Diff current env against a snapshot

```bash
envsnap diff
envsnap diff staging
```

```
  .env

  - DATABASE_URL=****
  + DATABASE_URL=****
  + NEW_KEY=****
```

Values are masked so secrets never appear in terminal output.

### Delete a snapshot

```bash
envsnap delete staging
# or
envsnap rm staging
```

## How it works

- Snapshots are stored in `~/.envsnap/snapshots/` as JSON files
- All `.env*` files in the current directory are captured (`env`, `.env.local`, `.env.production`, etc.)
- Diffs mask values so only key names are compared visibly

## Commands

| Command | Alias | Description |
|---------|-------|-------------|
| `save [name]` | | Snapshot current .env files |
| `restore [name]` | | Restore .env files from snapshot |
| `list` | `ls` | List all snapshots |
| `diff [name]` | | Diff current env vs snapshot |
| `delete <name>` | `rm` | Delete a snapshot |

### Flags

| Flag | Command | Description |
|------|---------|-------------|
| `--force` / `-f` | `save` | Overwrite existing snapshot |
| `--yes` / `-y` | `restore` | Skip confirmation prompt |

## License

MIT
