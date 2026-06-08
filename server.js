const express = require('express')
const dotenv = require('dotenv')
const connectDB = require('./config/db')
const Post = require('./models/Post')
const User = require('./models/User')

dotenv.config({ quiet: true })
const app = express()
const PORT = process.env.PORT || 5000

app.use(express.json())

// small logger so I can see what Postman is hitting
app.use((req, res, next) => {
  const timeNow = new Date().toLocaleTimeString()
  console.log(`[${req.method}] ${req.path} - ${timeNow}`)
  next()
})

app.get('/', (req, res) => {
  res.status(200).json({
    message: 'The Data Hub API Running'
  })
})

app.get('/users', async (req, res) => {
  try {
    const users = await User.find()
    res.status(200).json(users)
  } catch (error) {
    console.log('Users list error:', error.message)
    res.status(400).json({ message: 'Could not get users' })
  }
})

app.post('/users', async (req, res) => {
  try {
    const name = req.body.name
    const email = req.body.email

    if (!name && !email) {
      return res.status(400).json({
        message: 'Please send name or email'
      })
    }

    const newUser = await User.create({
      name: name,
      email: email
    })

    console.log('User added:', newUser.name)
    res.status(201).json(newUser)
  } catch (error) {
    console.log('Create user error:', error.message)
    res.status(400).json({ message: 'Could not create user' })
  }
})

app.get('/posts', async (req, res) => {
  try {
    console.log('Sending all blog posts from db')
    const posts = await Post.find()
    res.status(200).json(posts)
  } catch (error) {
    console.log('Error getting posts:', error.message)
    res.status(400).json({ message: 'Could not get posts' })
  }
})

app.get('/posts/populated', async (req, res) => {
  try {
    const posts = await Post.find().populate('authorId')
    res.status(200).json(posts)
  } catch (error) {
    console.log('Populate route error:', error.message)
    res.status(400).json({ message: 'Could not get populated posts' })
  }
})

app.get('/posts/recent/top3', async (req, res) => {
  try {
    const posts = await Post.find().sort({ createdAt: -1 }).limit(3)
    res.status(200).json(posts)
  } catch (error) {
    console.log('Recent posts error:', error.message)
    res.status(400).json({ message: 'Could not get recent posts' })
  }
})

app.get('/posts/:id', async (req, res) => {
  try {
    const postId = req.params.id.trim()
    const post = await Post.findById(postId)

    if (!post) {
      return res.status(404).json({ message: 'Post was not found' })
    }

    res.status(200).json(post)
  } catch (error) {
    console.log('Single post error:', error.message)
    res.status(400).json({ message: 'Invalid post id or request' })
  }
})

app.post('/posts', async (req, res) => {
  try {
    const title = req.body.title
    const content = req.body.content
    const authorId = req.body.authorId

    if (!title || !content || title.trim() === '' || content.trim() === '') {
      return res.status(400).json({
        message: 'Title and content are required'
      })
    }

    const newPost = await Post.create({
      title: title,
      content: content,
      authorId: authorId
    })

    console.log('New post added:', newPost.title)
    res.status(201).json(newPost)
  } catch (error) {
    console.log('Create post error:', error.message)
    res.status(400).json({ message: 'Could not create post' })
  }
})

app.put('/posts/:id', async (req, res) => {
  try {
    const postId = req.params.id.trim()
    const title = req.body.title
    const content = req.body.content
    const authorId = req.body.authorId

    if (!title || !content || title.trim() === '' || content.trim() === '') {
      return res.status(400).json({
        message: 'Please send title and content'
      })
    }

    const updatedPost = await Post.findByIdAndUpdate(
      postId,
      {
        title: title,
        content: content,
        authorId: authorId
      },
      { new: true, runValidators: true }
    )

    if (!updatedPost) {
      return res.status(404).json({ message: 'Post was not found' })
    }

    console.log('Updated post id', postId)
    res.status(200).json(updatedPost)
  } catch (error) {
    console.log('Update post error:', error.message)
    res.status(400).json({ message: 'Could not update post' })
  }
})

app.delete('/posts/:id', async (req, res) => {
  try {
    const postId = req.params.id.trim()
    const deletedPost = await Post.findByIdAndDelete(postId)

    if (!deletedPost) {
      return res.status(404).json({ message: 'Post was not found' })
    }

    console.log('Deleted post:', deletedPost.title)

    res.status(200).json({
      message: 'Post deleted',
      post: deletedPost
    })
  } catch (error) {
    console.log('Delete post error:', error.message)
    res.status(400).json({ message: 'Could not delete post' })
  }
})

app.post('/login', (req, res) => {
  const username = req.body.username
  const password = req.body.password

  if (!username || !password) {
    return res.status(400).json({
      message: 'Username and password are required'
    })
  }

  // this is just a fake login for the assignment, not real auth
  console.log('Login tried for user:', username)
  res.status(200).json({
    token: 'mock-jwt-token'
  })
})

app.use((req, res) => {
  res.status(404).json({
    message: 'Route not found'
  })
})

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log('The Data Hub API started')
    console.log(`Server running on http://localhost:${PORT}`)
  })
})
