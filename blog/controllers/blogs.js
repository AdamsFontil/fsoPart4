const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const logger = require('../utils/logger')
const User = require('../models/user')


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


blogsRouter.post('/', async (request, response) => {
  const body = request.body
  const user = await User.findById(body.userId)

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
  // response.status(201).json(savedBlog)
  response.json(savedBlog)
})

blogsRouter.delete('/:id', async (request, response) => {
  await Blog.findByIdAndRemove(request.params.id)
  response.status(204).end()
})


blogsRouter.put('/:id', async (request, response) => {
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
