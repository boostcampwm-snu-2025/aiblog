import * as fs from 'fs';
import * as path from 'path';
import { v4 as uuidv4 } from 'uuid';

const DATA_DIR = path.join(process.cwd(), 'data');
const BLOGS_FILE = path.join(DATA_DIR, 'blogs.json');

export interface BlogPost {
  id: string;
  title: string;
  content: string;
  summary?: string;
  commitSha: string;
  owner: string;
  repo: string;
  author: string;
  filesChanged: string[];
  stats: {
    additions: number;
    deletions: number;
    total: number;
  };
  published: boolean;
  createdAt: string;
  updatedAt: string;
  publishedAt?: string;
}

/**
 * 데이터 디렉토리 및 파일 초기화
 */
function ensureDataFileExists(): void {
  // data 디렉토리가 없으면 생성
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }

  // blogs.json 파일이 없으면 빈 배열로 초기화
  if (!fs.existsSync(BLOGS_FILE)) {
    fs.writeFileSync(BLOGS_FILE, JSON.stringify([], null, 2), 'utf-8');
  }
}

/**
 * 모든 블로그 읽기
 */
function readBlogs(): BlogPost[] {
  ensureDataFileExists();
  const data = fs.readFileSync(BLOGS_FILE, 'utf-8');
  return JSON.parse(data) as BlogPost[];
}

/**
 * 블로그 목록 저장
 */
function writeBlogs(blogs: BlogPost[]): void {
  ensureDataFileExists();
  fs.writeFileSync(BLOGS_FILE, JSON.stringify(blogs, null, 2), 'utf-8');
}

/**
 * 새 블로그 게시
 */
export function publishBlog(data: {
  title: string;
  content: string;
  summary?: string;
  commitSha: string;
  owner: string;
  repo: string;
  author: string;
  filesChanged: string[];
  stats: {
    additions: number;
    deletions: number;
    total: number;
  };
}): BlogPost {
  const blogs = readBlogs();

  const now = new Date().toISOString();
  const newBlog: BlogPost = {
    id: uuidv4(),
    ...data,
    published: true,
    createdAt: now,
    updatedAt: now,
    publishedAt: now,
  };

  blogs.unshift(newBlog); // 최신 블로그를 맨 앞에 추가
  writeBlogs(blogs);

  return newBlog;
}

/**
 * 게시된 블로그 목록 조회 (페이징 지원)
 */
export function getBlogList(options: {
  page?: number;
  perPage?: number;
  publishedOnly?: boolean;
}): {
  items: BlogPost[];
  pagination: {
    page: number;
    perPage: number;
    total: number;
    totalPages: number;
  };
} {
  const { page = 1, perPage = 10, publishedOnly = true } = options;

  let blogs = readBlogs();

  // 게시된 블로그만 필터링
  if (publishedOnly) {
    blogs = blogs.filter(blog => blog.published);
  }

  const total = blogs.length;
  const totalPages = Math.ceil(total / perPage);
  const startIndex = (page - 1) * perPage;
  const endIndex = startIndex + perPage;

  const items = blogs.slice(startIndex, endIndex);

  return {
    items,
    pagination: {
      page,
      perPage,
      total,
      totalPages,
    },
  };
}

/**
 * 특정 블로그 조회
 */
export function getBlogById(id: string): BlogPost | null {
  const blogs = readBlogs();
  return blogs.find(blog => blog.id === id) || null;
}

/**
 * 블로그 수정
 */
export function updateBlog(id: string, updates: Partial<BlogPost>): BlogPost | null {
  const blogs = readBlogs();
  const index = blogs.findIndex(blog => blog.id === id);

  if (index === -1) {
    return null;
  }

  const updatedBlog = {
    ...blogs[index],
    ...updates,
    id: blogs[index].id, // ID는 변경 불가
    createdAt: blogs[index].createdAt, // 생성일은 변경 불가
    updatedAt: new Date().toISOString(),
  };

  blogs[index] = updatedBlog;
  writeBlogs(blogs);

  return updatedBlog;
}

/**
 * 블로그 삭제
 */
export function deleteBlog(id: string): boolean {
  const blogs = readBlogs();
  const filteredBlogs = blogs.filter(blog => blog.id !== id);

  if (filteredBlogs.length === blogs.length) {
    return false; // 삭제할 블로그를 찾지 못함
  }

  writeBlogs(filteredBlogs);
  return true;
}
