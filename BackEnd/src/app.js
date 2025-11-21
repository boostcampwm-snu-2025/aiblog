const express = require('express')
const cors = require('cors')
const passport = require('passport')
require('./config/passport')
const authRoutes = require('./routes/authRoutes')
const githubRoutes = require('./routes/githubRoutes')
const geminiRoutes = require('./routes/geminiRoutes')
const postRoutes = require('./routes/postRoutes')

const app = express()

// Middleware
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Passport 초기화
app.use(passport.initialize())

// Routes
console.log('=== Express 라우트 마운트 ===')
app.use('/api/auth', authRoutes)
console.log('✓ /api/auth 마운트됨')
app.use('/api/github', githubRoutes)
console.log('✓ /api/github 마운트됨')
app.use('/api/gemini', geminiRoutes)
console.log('✓ /api/gemini 마운트됨')
app.use('/api/posts', postRoutes)
console.log('✓ /api/posts 마운트됨')

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK' })
})

module.exports = app
