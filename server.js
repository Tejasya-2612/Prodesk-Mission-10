const express = require('express')

const app = express()
const PORT = 5000

app.use(express.json())

// small logger so I can see what Postman is hitting
app.use((req, res, next) => {
  const timeNow = new Date().toLocaleTimeString()
  console.log(`[${req.method}] ${req.path} - ${timeNow}`)
  next()
})

let blogPosts = []
let nextId = 1

app.get('/', (req, res) => {
  res.status(200).json({
    message: 'The Data Hub API Running'
  })
})

app.get('/posts', (req, res) => {
  console.log('Sending all blog posts')
  res.status(200).json(blogPosts)
})

app.get('/posts/:id', (req, res) => {
  const postId = Number(req.params.id)
  const post = blogPosts.find((item) => item.id === postId)

  if (!post) {
    return res.status(404).json({ message: 'Post was not found' })
  }

  res.status(200).json(post)
})

app.post('/posts', (req, res) => {
  const title = req.body.title
  const content = req.body.content

  if (!title || !content || title.trim() === '' || content.trim() === '') {
    return res.status(400).json({
      message: 'Title and content are required'
    })
  }

  const newPost = {
    id: nextId,
    title: title,
    content: content
  }

  blogPosts.push(newPost)
  nextId++

  console.log('New post added:', newPost.title)
  res.status(201).json(newPost)
})

app.put('/posts/:id', (req, res) => {
  const postId = Number(req.params.id)
  const post = blogPosts.find((item) => item.id === postId)

  if (!post) {
    return res.status(404).json({ message: 'Post was not found' })
  }

  const title = req.body.title
  const content = req.body.content

  if (!title || !content || title.trim() === '' || content.trim() === '') {
    return res.status(400).json({
      message: 'Please send title and content'
    })
  }

  post.title = title
  post.content = content

  console.log('Updated post id', postId)
  res.status(200).json(post)
})

app.delete('/posts/:id', (req, res) => {
  const postId = Number(req.params.id)
  const postIndex = blogPosts.findIndex((item) => item.id === postId)

  if (postIndex === -1) {
    return res.status(404).json({ message: 'Post was not found' })
  }

  const deletedPost = blogPosts.splice(postIndex, 1)
  console.log('Deleted post:', deletedPost[0].title)

  res.status(200).json({
    message: 'Post deleted',
    post: deletedPost[0]
  })
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

app.listen(PORT, () => {
  console.log('The Data Hub API started')
  console.log(`Server running on http://localhost:${PORT}`)
})
