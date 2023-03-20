const http = require('http')
const express = require('express')
const app = express()
const cors = require('cors')
const mongoose = require('mongoose')
require('dotenv').config()

const blogSchema = new mongoose.Schema({
  title: String,
  author: String,
  url: String,
  likes: Number
})

const Blog = mongoose.model('Blog', blogSchema)

const mongoUrl = process.env.MONGODB_URI || `mongodb+srv://adamsfuntil:0pxRduTyxlxyp67p@cluster0.qcbbps7.mongodb.net/?retryWrites=true&w=majority`
console.log(process.env.MONGODB_URI)
mongoose.connect(mongoUrl)
.then(console.log('connected to mongoDB'))

app.use(cors())
app.use(express.json())

app.get('/api/blogs', (request, response) => {
    console.log('get them all')
  Blog
    .find({})
    .then(blogs => {
      response.json(blogs)
    })
})

app.post('/api/blogs', (request, response) => {
  const blog = new Blog(request.body)
    console.log('adding new blog....')
  blog
    .save()
    .then(result => {
      response.status(201).json(result)
      console.log('added....', result)
    })
})

const PORT = process.env.PORT || 3005
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})

// const http = require('http')
// const express = require('express')
// const app = express()
// const cors = require('cors')
// const mongoose = require('mongoose')

// const blogSchema = new mongoose.Schema({
//   title: String,
//   author: String,
//   url: String,
//   likes: Number
// })

// const Blog = mongoose.model('Blog', blogSchema)

// const mongoUrl = 'mongodb+srv://adamsfuntil:0pxRduTyxlxyp67p@cluster0.qcbbps7.mongodb.net/?retryWrites=true&w=majority'


// mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true })
//   .then(() => console.log('Connected to MongoDB'))
//   .catch(error => console.error('Error connecting to MongoDB:', error.message))

// app.use(cors())
// app.use(express.json())

// app.get('/api/blogs', async (request, response, next) => {
//   try {
//     console.log('getting all blogs')
//     const blogs = await Blog.find({})
//     response.json(blogs)
//   } catch (error) {
//     next(error)
//   }
// })

// app.post('/api/blogs', async (request, response, next) => {
//   try {
//     const blog = new Blog(request.body)
//     const result = await blog.save()
//     response.status(201).json(result)
//   } catch (error) {
//     next(error)
//   }
// })

// app.use((error, request, response, next) => {
//   console.error(error)
//   response.status(500).json({ error: 'Internal server error' })
// })

// const PORT = process.env.PORT || 3001
// app.listen(PORT, () => {
//   console.log(`Server running on port ${PORT}`)
// })
