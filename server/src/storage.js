import { readFile, writeFile, mkdir } from 'fs/promises';
import { existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname  = dirname(__filename);

const DB_DIR  = join(__dirname, '..', '.data');
const DB_PATH = join(DB_DIR, 'posts.json');

async function ensure() {
  if (!existsSync(DB_DIR)) await mkdir(DB_DIR, { recursive: true });
  if (!existsSync(DB_PATH)) await writeFile(DB_PATH, JSON.stringify([]), 'utf-8');
}

export async function listPosts() {
  await ensure();
  const buf = await readFile(DB_PATH, 'utf-8');
  try {
    return JSON.parse(buf);
  } catch {
    return [];
  }
}

export async function savePost(post) {
  await ensure();
  const posts = await listPosts();
  const now = new Date().toISOString();
  const withId = { id: crypto.randomUUID(), createdAt: now, ...post };
  posts.unshift(withId);
  await writeFile(DB_PATH, JSON.stringify(posts, null, 2), 'utf-8');
  return withId;
}

export async function removePost(id) {
  await ensure();
  const posts = await listPosts();
  const next = posts.filter(p => p.id !== id);
  await writeFile(DB_PATH, JSON.stringify(next, null, 2), 'utf-8');
  return { ok: true };
}
