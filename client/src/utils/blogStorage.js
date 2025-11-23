/**
 * localStorage 기반 블로그 저장/관리 유틸리티
 */

const STORAGE_KEY = 'github_blog_posts';

/**
 * 고유 ID 생성 함수
 */
const generateId = () => {
  return `blog_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

/**
 * 모든 블로그 가져오기
 * @returns {Array} 블로그 목록
 */
export const getBlogs = () => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Error reading blogs from localStorage:', error);
    return [];
  }
};

/**
 * 특정 블로그 가져오기
 * @param {string} id - 블로그 ID
 * @returns {Object|null} 블로그 객체 또는 null
 */
export const getBlogById = (id) => {
  try {
    const blogs = getBlogs();
    return blogs.find(blog => blog.id === id) || null;
  } catch (error) {
    console.error('Error getting blog by id:', error);
    return null;
  }
};

/**
 * 새 블로그 저장
 * @param {Object} blogData - 블로그 데이터 { title, content, activityType, repoInfo }
 * @returns {Object} 저장된 블로그 객체 (id 포함)
 */
export const saveBlog = (blogData) => {
  try {
    const blogs = getBlogs();

    // 새 블로그 객체 생성
    const newBlog = {
      id: generateId(),
      title: blogData.title,
      content: blogData.content,
      createdAt: blogData.createdAt || new Date().toISOString(),
      activityType: blogData.activityType || 'unknown',
      repoInfo: blogData.repoInfo || null,
    };

    // 맨 앞에 추가 (최신순)
    const updatedBlogs = [newBlog, ...blogs];

    // localStorage에 저장
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedBlogs));

    return newBlog;
  } catch (error) {
    console.error('Error saving blog to localStorage:', error);
    throw new Error('블로그 저장에 실패했습니다.');
  }
};

/**
 * 블로그 삭제
 * @param {string} id - 삭제할 블로그 ID
 * @returns {boolean} 성공 여부
 */
export const deleteBlog = (id) => {
  try {
    const blogs = getBlogs();
    const filteredBlogs = blogs.filter(blog => blog.id !== id);

    localStorage.setItem(STORAGE_KEY, JSON.stringify(filteredBlogs));
    return true;
  } catch (error) {
    console.error('Error deleting blog:', error);
    return false;
  }
};

/**
 * 블로그 업데이트
 * @param {string} id - 업데이트할 블로그 ID
 * @param {Object} updates - 업데이트할 필드들
 * @returns {Object|null} 업데이트된 블로그 또는 null
 */
export const updateBlog = (id, updates) => {
  try {
    const blogs = getBlogs();
    const index = blogs.findIndex(blog => blog.id === id);

    if (index === -1) {
      return null;
    }

    // 업데이트된 블로그 객체
    blogs[index] = {
      ...blogs[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    localStorage.setItem(STORAGE_KEY, JSON.stringify(blogs));
    return blogs[index];
  } catch (error) {
    console.error('Error updating blog:', error);
    return null;
  }
};

/**
 * 모든 블로그 삭제 (초기화)
 * @returns {boolean} 성공 여부
 */
export const clearAllBlogs = () => {
  try {
    localStorage.removeItem(STORAGE_KEY);
    return true;
  } catch (error) {
    console.error('Error clearing all blogs:', error);
    return false;
  }
};
