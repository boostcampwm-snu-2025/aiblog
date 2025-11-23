import { GoogleGenAI } from '@google/genai';
import { Octokit } from 'octokit';
import dotenv from 'dotenv';
import fs from 'fs/promises';
import path from 'path';

dotenv.config({ path: '../.env' });

// Initialize external clients
const githubToken = process.env.GITHUB_TOKEN;
const geminiAPIKey = process.env.GEMINI_API_KEY;
const ai = new GoogleGenAI({ apiKey: geminiAPIKey });
const octokit = new Octokit({ auth: githubToken });

// Path to store saved blogs
const dataDir = path.resolve('./data');
const blogsFile = path.join(dataDir, 'blogs.json');

async function ensureDataFile() {
  try {
    await fs.mkdir(dataDir, { recursive: true });
    try {
      await fs.access(blogsFile);
    } catch (err) {
      await fs.writeFile(blogsFile, JSON.stringify([]));
    }
  } catch (err) {
    console.error('Error ensuring data file:', err);
  }
}

async function readBlogs() {
  await ensureDataFile();
  const raw = await fs.readFile(blogsFile, 'utf-8');
  try { return JSON.parse(raw || '[]'); } catch (e) { return []; }
}

async function writeBlogs(list) {
  await ensureDataFile();
  await fs.writeFile(blogsFile, JSON.stringify(list, null, 2), 'utf-8');
}

export { ai, octokit, dataDir, blogsFile, ensureDataFile, readBlogs, writeBlogs };
