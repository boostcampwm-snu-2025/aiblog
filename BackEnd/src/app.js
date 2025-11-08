const express = require('express')
const cors = require('cors')
const passport = require('passport')
require('./config/passport')
const authRoutes = require('./routes/authRoutes')

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
app.use('/api/auth', authRoutes)

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK' })
})

module.exports = app
