const fs = require('fs')
const path = require('path')
const { v4: uuidv4 } = require('uuid')
const { handleError } = require('../utils/errorHandler')

const dataDir = path.join(__dirname, '../../data')
const postsFile = path.join(dataDir, 'posts.json')

// 데이터 디렉토리 생성 (없으면)
const ensureDataDir = () => {
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true })
  }
}

// 포스트 파일 초기화 (없으면 빈 배열로 생성)
const ensurePostsFile = () => {
  ensureDataDir()
  if (!fs.existsSync(postsFile)) {
    fs.writeFileSync(postsFile, JSON.stringify([], null, 2))
  }
}

// 포스트 목록 읽기
const readPosts = () => {
  try {
    ensurePostsFile()
    const data = fs.readFileSync(postsFile, 'utf-8')
    return JSON.parse(data)
  } catch (error) {
    console.error('포스트 읽기 오류:', error)
    return []
  }
}

// 포스트 목록 쓰기
const writePosts = (posts) => {
  try {
    ensurePostsFile()
    fs.writeFileSync(postsFile, JSON.stringify(posts, null, 2))
    return true
  } catch (error) {
    console.error('포스트 쓰기 오류:', error)
    return false
  }
}

/**
 * 포스트 저장
 * POST /api/posts
 * 요청 바디:
 * {
 *   type: 'commit' | 'pr',
 *   typeLabel: 'Commit' | 'Pull Request',
 *   message: string (commit),
 *   title: string (pr),
 *   author: string,
 *   date: string,
 *   summary: string,
 *   status: string (pr만),
 *   number: number (pr만)
 * }
 * 응답: 생성된 포스트 정보 (id 포함)
 */
const createPost = (req, res) => {
  try {
    const { type, typeLabel, message, title, author, date, summary, status, number } = req.body

    if (!type || !author || !date) {
      return res.status(400).json({
        error: '필수 필드 누락',
        message: 'type, author, date는 필수입니다.'
      })
    }

    const post = {
      id: uuidv4(),
      type,
      typeLabel,
      message: type === 'commit' ? message : undefined,
      title: type === 'pr' ? title : undefined,
      author,
      date,
      summary,
      createdAt: new Date().toISOString(),
      status: type === 'pr' ? status : undefined,
      number: type === 'pr' ? number : undefined
    }

    const posts = readPosts()
    posts.push(post)

    if (writePosts(posts)) {
      return res.status(201).json({
        message: '포스트가 저장되었습니다.',
        post
      })
    } else {
      return res.status(500).json({
        error: '포스트 저장 실패',
        message: '파일 쓰기 중 오류가 발생했습니다.'
      })
    }
  } catch (error) {
    return handleError(error, res, '포스트 저장 중 오류', 500)
  }
}

/**
 * 포스트 조회 (페이지네이션)
 * GET /api/posts?page=1
 * Query 파라미터:
 *   - page: 페이지 번호 (기본값: 1)
 * 응답: createdAt 기준 최신순으로 정렬된 포스트 배열 (10개씩)
 */
const getPosts = (req, res) => {
  try {
    const page = Math.max(1, parseInt(req.query.page) || 1)
    const perPage = 10

    const posts = readPosts()
    // createdAt 기준 최신순으로 정렬
    const sortedPosts = posts.sort((a, b) =>
      new Date(b.createdAt) - new Date(a.createdAt)
    )

    const total = sortedPosts.length
    const totalPages = Math.ceil(total / perPage)
    const skip = (page - 1) * perPage
    const paginatedPosts = sortedPosts.slice(skip, skip + perPage)

    return res.status(200).json({
      total,
      posts: paginatedPosts,
      page,
      perPage,
      totalPages
    })
  } catch (error) {
    return handleError(error, res, '포스트 조회 중 오류', 500)
  }
}

/**
 * 특정 포스트 조회
 * GET /api/posts/:id
 */
const getPostById = (req, res) => {
  try {
    const { id } = req.params
    const posts = readPosts()
    const post = posts.find(p => p.id === id)

    if (!post) {
      return res.status(404).json({
        error: '포스트를 찾을 수 없습니다.',
        message: `ID: ${id}`
      })
    }

    return res.status(200).json(post)
  } catch (error) {
    return handleError(error, res, '포스트 조회 중 오류', 500)
  }
}

/**
 * 포스트 삭제
 * DELETE /api/posts/:id
 */
const deletePost = (req, res) => {
  try {
    const { id } = req.params
    const posts = readPosts()
    const postIndex = posts.findIndex(p => p.id === id)

    if (postIndex === -1) {
      return res.status(404).json({
        error: '포스트를 찾을 수 없습니다.',
        message: `ID: ${id}`
      })
    }

    const deletedPost = posts[postIndex]
    posts.splice(postIndex, 1)

    if (writePosts(posts)) {
      return res.status(200).json({
        message: '포스트가 삭제되었습니다.',
        deletedPost
      })
    } else {
      return res.status(500).json({
        error: '포스트 삭제 실패',
        message: '파일 쓰기 중 오류가 발생했습니다.'
      })
    }
  } catch (error) {
    return handleError(error, res, '포스트 삭제 중 오류', 500)
  }
}

module.exports = {
  createPost,
  getPosts,
  getPostById,
  deletePost
}
