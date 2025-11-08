import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { nanoid } from 'nanoid';

export interface Post { id: string; title: string; markdown: string; tags?: string[]; createdAt: string; updatedAt: string; }

const file = process.env.POSTS_FILE || './data/posts.json';
async function ensure() { await mkdir(file.replace(/\/[^/]+$/, ''), { recursive:true }); try { await readFile(file, 'utf8'); } catch { await writeFile(file, '[]'); } }
async function load(): Promise<Post[]> { await ensure(); return JSON.parse(await readFile(file,'utf8')) }
async function save(data: Post[]) { await writeFile(file, JSON.stringify(data,null,2)); }

export const PostsRepo = {
  async list() { return load(); },
  async get(id: string) { return (await load()).find(p=>p.id===id) || null; },
  async create(input: Pick<Post, 'title'|'markdown'|'tags'>) {
    const now = new Date().toISOString(); const p: Post = { id: nanoid(12), createdAt: now, updatedAt: now, ...input } as Post;
    const all = await load(); all.unshift(p); await save(all); return p;
  },
  async update(id: string, patch: Partial<Pick<Post,'title'|'markdown'|'tags'>>) {
    const all = await load(); const i = all.findIndex(p=>p.id===id); if (i<0) return null; all[i] = { ...all[i], ...patch, updatedAt: new Date().toISOString() }; await save(all); return all[i];
  },
  async remove(id: string) {
    const all = await load(); const i = all.findIndex(p=>p.id===id); if (i<0) return false; all.splice(i,1); await save(all); return true;
  }
};