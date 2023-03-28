const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const logger = require('../utils/logger')
const User = require('../models/user')
const { userExtractor } = require('../utils/middleware')
// const jwt = require('jsonwebtoken')


// const getTokenFrom = request => {
//   const authorization = request.get('authorization')
//   if (authorization && authorization.startsWith('Bearer ')) {
//     return authorization.replace('Bearer ', '')
//   }
//   return null
// }


blogsRouter.get('/', async (request, response) => {
  logger.info('getting all blogs')
  const blogs = await Blog.find({}).populate('user', { username: 1, name: 1 })
  logger.info('all of the blogs...', blogs)
  response.json(blogs)
})

blogsRouter.get('/:id',  async (request, response) => {
  const blog = await Blog.findById(request.params.id)
  if (blog) {
    response.json(blog)
  } else {
    response.status(404).end()
  }
})


blogsRouter.post('/', userExtractor, async (request, response) => {
  const body = request.body
  // const user = await User.findById(body.userId)
  const userExtractor = request.user
  const user = await User.findById(userExtractor.id)

  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes,
    user: user.id
  })
  if (!blog.likes) {
    blog.likes = 0
  } else if (!blog.title || !blog.url) {
    console.log('no title or no url')
    return response.status(400).send({ error: 'title or url missing' })
  }
  const savedBlog = await blog.save()
  user.blogs = user.blogs.concat(savedBlog._id)
  await user.save()
  response.status(201).json(savedBlog)
  // response.json(savedBlog)
})

blogsRouter.delete('/:id', userExtractor, async (request, response) => {
  const blog = await Blog.findById(request.params.id)
  // const user = jwt.verify(request.token, process.env.SECRET)
  const user = request.user

  // console.log('blog',blog)
  // console.log('user',user)
  // console.log('bloguser',blog.user)
  // console.log('bloguser',user.id)
  if ( blog.user.toString() === user.id.toString() ) {
    await Blog.findByIdAndRemove(request.params.id)
    console.log('bloguser',blog.user.toString())
    console.log('userid',user.id.toString())
    response.status(204).end()
  } else {
    response.status(401).json({ error: 'Unauthorized' })
  }
})



blogsRouter.put('/:id', userExtractor, async (request, response) => {
  const body = request.body

  const blog = {
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes
  }
  const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, blog, { new: true })
  response.status(202).json(updatedBlog)
})

module.exports = blogsRouter
