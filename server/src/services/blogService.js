import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Blog Storage Service using File System
 */

// Get storage path from environment or use default
const STORAGE_PATH = process.env.BLOG_STORAGE_PATH || path.join(__dirname, '../../blogs');

/**
 * Initialize storage directory
 */
const initializeStorage = async () => {
  try {
    await fs.access(STORAGE_PATH);
  } catch {
    await fs.mkdir(STORAGE_PATH, { recursive: true });
    console.log(`📁 Created blog storage directory: ${STORAGE_PATH}`);
  }
};

/**
 * Generate unique blog ID
 */
const generateBlogId = () => {
  return `blog_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

/**
 * Save blog to file system
 * @param {Object} blogData - Blog data to save
 * @returns {Promise<Object>} Saved blog with ID
 */
export const saveBlog = async (blogData) => {
  try {
    await initializeStorage();
    
    const blogId = generateBlogId();
    const timestamp = new Date().toISOString();
    
    const blog = {
      id: blogId,
      ...blogData,
      createdAt: timestamp
    };
    
    const filePath = path.join(STORAGE_PATH, `${blogId}.json`);
    await fs.writeFile(filePath, JSON.stringify(blog, null, 2), 'utf-8');
    
    console.log(`💾 Blog saved: ${blogId}`);
    return blog;
  } catch (error) {
    console.error('Error saving blog:', error);
    throw new Error(`Failed to save blog: ${error.message}`);
  }
};

/**
 * Get blog by ID
 * @param {string} blogId - Blog ID
 * @returns {Promise<Object>} Blog data
 */
export const getBlogById = async (blogId) => {
  try {
    const filePath = path.join(STORAGE_PATH, `${blogId}.json`);
    const data = await fs.readFile(filePath, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    if (error.code === 'ENOENT') {
      throw new Error('Blog not found');
    }
    throw new Error(`Failed to read blog: ${error.message}`);
  }
};

/**
 * Get all blogs (limited)
 * @param {number} limit - Maximum number of blogs to return
 * @returns {Promise<Array>} Array of blog summaries
 */
export const getAllBlogs = async (limit = 50) => {
  try {
    await initializeStorage();
    
    const files = await fs.readdir(STORAGE_PATH);
    const blogFiles = files.filter(file => file.endsWith('.json'));
    
    const blogs = await Promise.all(
      blogFiles.slice(0, limit).map(async (file) => {
        const filePath = path.join(STORAGE_PATH, file);
        const data = await fs.readFile(filePath, 'utf-8');
        const blog = JSON.parse(data);
        
        // Return summary only
        return {
          id: blog.id,
          type: blog.type,
          title: blog.title,
          repoName: blog.repoName,
          createdAt: blog.createdAt,
          sourceData: {
            sha: blog.sourceData?.sha,
            number: blog.sourceData?.number
          }
        };
      })
    );
    
    // Sort by creation date (newest first)
    blogs.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    
    return blogs;
  } catch (error) {
    console.error('Error getting blogs:', error);
    throw new Error(`Failed to get blogs: ${error.message}`);
  }
};

/**
 * Delete blog by ID
 * @param {string} blogId - Blog ID
 * @returns {Promise<void>}
 */
export const deleteBlog = async (blogId) => {
  try {
    const filePath = path.join(STORAGE_PATH, `${blogId}.json`);
    await fs.unlink(filePath);
    console.log(`🗑️  Blog deleted: ${blogId}`);
  } catch (error) {
    if (error.code === 'ENOENT') {
      throw new Error('Blog not found');
    }
    throw new Error(`Failed to delete blog: ${error.message}`);
  }
};
