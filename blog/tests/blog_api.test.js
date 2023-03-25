const supertest = require('supertest')
const mongoose = require('mongoose')
const helper = require('./test_helper')
const app = require('../app')
const api = supertest(app)

const Blog = require('../models/blog')

beforeEach(async () => {
  await Blog.deleteMany({})
  await Blog.insertMany(helper.initialBlogs)
})

describe('when there is already some blogs in db', () => {
  test('blogs are returned as json', async () => {
    await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })

  test('blogs correct length is returned', async () => {
    const response = await api.get('/api/blogs')

    expect(response.body).toHaveLength(helper.initialBlogs.length)
  })

  test('id exists', async () => {
    const response = await api.get('/api/blogs')
    console.log('body',response.body)
    console.log('body id',response.body.id)
    response.body.forEach(blog => {
      console.log(blog)
      expect(blog.id).toBeDefined()
    })
  })
})


describe('adding new blogs', () => {
  test('succeeds with valid data', async () => {
    const newBlog = {
      'title': 'how to test Post Request with Jest',
      'author': 'fullStackOpen',
      'url': 'fso.com',
      'likes': 34
    }

    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const blogsAtEnd = await helper.blogsInDb()
    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length + 1)

    const titles = blogsAtEnd.map(n => n.title)
    expect(titles).toContain(
      'how to test Post Request with Jest'
    )
  })

  test('no likes means 0', async () => {
    const newBlog = {
      'title': 'testing likes',
      'author': 'fullStackOpen',
      'url': 'fso.com'
    }

    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(201)

    const response = await api.get('/api/blogs')

    const lastBlog = response.body.slice(-1)[0]
    expect(lastBlog.likes).toBe(0)
  })

  test('no title or url mean 400', async () => {
    const newBlog = {
      'author': 'fullStackOpen',
      'url': 'fso.com',
      'likes': 49
    }

    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(400)
  })
})



describe('deletion of a blog', () => {
  test('succeeds with status code 204 if id is valid', async () => {
    const blogsAtStart = await helper.blogsInDb()
    const blogToDelete = blogsAtStart[0]

    await api
      .delete(`/api/blogs/${blogToDelete.id}`)
      .expect(204)

    const blogsAtEnd = await helper.blogsInDb()

    expect(blogsAtEnd).toHaveLength(
      helper.initialBlogs.length - 1
    )

    const titles = blogsAtEnd.map(r => r.title)

    expect(titles).not.toContain(blogToDelete.content)
  })
})


describe('updating a blog', () => {
  test('succeeds with the first blog', async () => {
    const blogsAtStart = await helper.blogsInDb()
    const blogToChange = blogsAtStart[0]
    const changedBlog = {
      'title': 'how to test backend',
      'author': 'fullStackOpen',
      'url': 'fso.com',
      'likes': 96
    }

    await api
      .put(`/api/blogs/${blogToChange.id}`)
      .send(changedBlog)
      .expect(202)

    const blogsAtEnd = await helper.blogsInDb()

    expect(blogsAtEnd).toHaveLength(blogsAtStart.length)
    expect(blogsAtEnd[0].title).toBe(changedBlog.title)
    expect(blogsAtEnd[0].author).toBe(changedBlog.author)
    expect(blogsAtEnd[0].url).toBe(changedBlog.url)
    expect(blogsAtEnd[0].likes).toBe(changedBlog.likes)
  })
})




afterAll(async () => {
  await mongoose.connection.close()
})
