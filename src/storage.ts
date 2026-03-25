import fs from 'fs';
import path from 'path';
import os from 'os';

export interface Snapshot {
  name: string;
  project: string;
  createdAt: string;
  files: Record<string, string>; // filename -> contents
}

export interface SnapshotIndex {
  snapshots: Array<{ name: string; project: string; createdAt: string; fileCount: number }>;
}

const STORE_DIR = path.join(os.homedir(), '.envsnap');
const SNAPSHOTS_DIR = path.join(STORE_DIR, 'snapshots');
const INDEX_FILE = path.join(STORE_DIR, 'index.json');

export function ensureStore(): void {
  fs.mkdirSync(SNAPSHOTS_DIR, { recursive: true });
  if (!fs.existsSync(INDEX_FILE)) {
    fs.writeFileSync(INDEX_FILE, JSON.stringify({ snapshots: [] }, null, 2));
  }
}

export function getIndex(): SnapshotIndex {
  ensureStore();
  return JSON.parse(fs.readFileSync(INDEX_FILE, 'utf-8'));
}

function saveIndex(index: SnapshotIndex): void {
  fs.writeFileSync(INDEX_FILE, JSON.stringify(index, null, 2));
}

export function saveSnapshot(snapshot: Snapshot): void {
  ensureStore();
  const filePath = path.join(SNAPSHOTS_DIR, `${snapshot.name}.json`);
  fs.writeFileSync(filePath, JSON.stringify(snapshot, null, 2));

  const index = getIndex();
  const existing = index.snapshots.findIndex(s => s.name === snapshot.name);
  const entry = {
    name: snapshot.name,
    project: snapshot.project,
    createdAt: snapshot.createdAt,
    fileCount: Object.keys(snapshot.files).length,
  };

  if (existing >= 0) {
    index.snapshots[existing] = entry;
  } else {
    index.snapshots.push(entry);
  }

  saveIndex(index);
}

export function loadSnapshot(name: string): Snapshot | null {
  ensureStore();
  const filePath = path.join(SNAPSHOTS_DIR, `${name}.json`);
  if (!fs.existsSync(filePath)) return null;
  return JSON.parse(fs.readFileSync(filePath, 'utf-8'));
}

export function deleteSnapshot(name: string): boolean {
  ensureStore();
  const filePath = path.join(SNAPSHOTS_DIR, `${name}.json`);
  if (!fs.existsSync(filePath)) return false;

  fs.unlinkSync(filePath);
  const index = getIndex();
  index.snapshots = index.snapshots.filter(s => s.name !== name);
  saveIndex(index);
  return true;
}

export function snapshotExists(name: string): boolean {
  return fs.existsSync(path.join(SNAPSHOTS_DIR, `${name}.json`));
}
