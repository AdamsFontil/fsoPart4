const supertest = require('supertest')
const mongoose = require('mongoose')
const helper = require('./test_helper')
const app = require('../app')
const api = supertest(app)

const Blog = require('../models/blog')

let loginToken

beforeEach(async () => {
  await Blog.deleteMany({})
  await Blog.insertMany(helper.initialBlogs)
  const loginInfo = {
    'username': 'Adams',
    'password': '12345'
  }
  const response = await api.post('/api/login').send(loginInfo)
  loginToken = response.body.token
})

module.exports = { loginToken }

describe('adding new blogs', () => {
  test('succeeds with valid token', async () => {
    const newBlog = {
      'title': 'how to test Post Request with Jest',
      'author': 'fullStackOpen',
      'url': 'fso.com',
      'likes': 34
    }

    await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${loginToken}`)
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
      .set('Authorization', `Bearer ${loginToken}`)
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
      .set('Authorization', `Bearer ${loginToken}`)
      .send(newBlog)
      .expect(400)
  })

  test('fails if no token', async () => {
    const newBlog = {
      'title': 'how to test Post Request with Jest',
      'author': 'fullStackOpen',
      'url': 'fso.com',
      'likes': 34
    }

    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(401)
      .expect('Content-Type', /application\/json/)

    const blogsAtEnd = await helper.blogsInDb()
    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length)
  })
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
    console.log('blogs', response.body)

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


describe('deletion of a blog', () => {
  test('succeeds with status code 204 if id is valid', async () => {
    const blogToRemove =  {
      'title': 'this should be deleted',
      'author': 'Arto Hellas',
      'url': 'hellaslitt.com',
      'likes': 3467
    }
    await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${loginToken}`)
      .send(blogToRemove)


    const blogsAtStart = await helper.blogsInDb()
    const blogToDelete = blogsAtStart.slice(-1)[0]

    await api
      .delete(`/api/blogs/${blogToDelete.id}`)
      .set('Authorization', `Bearer ${loginToken}`)
      .expect(204)

    const blogsAtEnd = await helper.blogsInDb()

    expect(blogsAtEnd).toHaveLength(
      helper.initialBlogs.length
    )

    const titles = blogsAtEnd.map(r => r.title)

    expect(titles).not.toContain(blogToDelete.title)
  })
  test('fails if no token', async () => {
    const blogToRemove =  {
      'title': 'this shouldnt be deleted',
      'author': 'Arto Hellas',
      'url': 'hellaslitt.com',
      'likes': 34
    }
    await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${loginToken}`)
      .send(blogToRemove)


    const blogsAtStart = await helper.blogsInDb()
    const blogToDelete = blogsAtStart.slice(-1)[0]

    await api
      .delete(`/api/blogs/${blogToDelete.id}`)
      .expect(401)

    const blogsAtEnd = await helper.blogsInDb()

    expect(blogsAtEnd).toHaveLength(
      helper.initialBlogs.length + 1
    )

    const titles = blogsAtEnd.map(r => r.title)

    expect(titles).toContain(blogToDelete.title)
  })

})


describe('updating a blog', () => {
  test('succeeds with valid token', async () => {
    const blogToUpdate =  {
      'title': 'this should be updated',
      'author': 'Arto Hellas',
      'url': 'hellaslitt.com',
      'likes': 34
    }
    await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${loginToken}`)
      .send(blogToUpdate)



    const blogsAtStart = await helper.blogsInDb()
    const blogToChange = blogsAtStart.slice(-1)[0]
    const changedBlog = {
      'title': 'this has been updated',
      'author': 'fullStackOpen',
      'url': 'fso.com',
      'likes': 96
    }

    await api
      .put(`/api/blogs/${blogToChange.id}`)
      .set('Authorization', `Bearer ${loginToken}`)
      .send(changedBlog)
      .expect(202)

    const blogsAtEnd = await helper.blogsInDb()
    console.log('blogs at start', blogsAtStart)
    console.log('blogs at end', blogsAtEnd)
    const updatedBlog = blogsAtEnd.slice(-1)[0]
    console.log(updatedBlog)

    expect(blogsAtEnd).toHaveLength(blogsAtStart.length)
    expect(updatedBlog.title).toBe(changedBlog.title)
    expect(updatedBlog.author).toBe(changedBlog.author)
    expect(updatedBlog.url).toBe(changedBlog.url)
    expect(updatedBlog.likes).toBe(changedBlog.likes)
  })
})

test('fails with no token', async () => {
  const blogWontUpdate =  {
    'title': 'this should be updated',
    'author': 'Arto Hellas',
    'url': 'hellaslitt.com',
    'likes': 34
  }
  await api
    .post('/api/blogs')
    .set('Authorization', `Bearer ${loginToken}`)
    .send(blogWontUpdate)



  const blogsAtStart = await helper.blogsInDb()
  const blogToChange = blogsAtStart.slice(-1)[0]
  const changedBlog = {
    'title': 'this wont be updated',
    'author': 'fullStackOpen',
    'url': 'fso.com',
    'likes': 96
  }

  await api
    .put(`/api/blogs/${blogToChange.id}`)
    .send(changedBlog)
    .expect(401)

  const blogsAtEnd = await helper.blogsInDb()
  console.log('blogs at start', blogsAtStart)
  console.log('blogs at end', blogsAtEnd)
  const updatedBlog = blogsAtEnd.slice(-1)[0]
  console.log(updatedBlog)

  expect(blogsAtEnd).toHaveLength(blogsAtStart.length)
  expect(updatedBlog.title).toBe(blogWontUpdate.title)
  expect(updatedBlog.author).toBe(blogWontUpdate.author)
  expect(updatedBlog.url).toBe(blogWontUpdate.url)
  expect(updatedBlog.likes).toBe(blogWontUpdate.likes)
})





afterAll(async () => {
  await mongoose.connection.close()
})
