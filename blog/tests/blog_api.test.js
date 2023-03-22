const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')

const api = supertest(app)


test('blogs are returned as json and their lengths too', async () => {
  await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)
  const response = await api.get('/api/blogs')

  expect(response.body).toHaveLength(response.body.length)
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

test('blogs can be added ', async () => {
  const firstResponse = await api.get('/api/blogs')
  const newBlog = {
    'title': 'testing backend',
    'author': 'fullStackOpen',
    'url': 'fso.com',
    'likes': 96334
  }

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const secondResponse = await api.get('/api/blogs')

  const contents = secondResponse.body.map(r => r.title)
  expect(secondResponse.body).toHaveLength(firstResponse.body.length + 1)
  expect(contents).toContain(
    'testing backend')
  console.log('contents', contents)
  console.log('firstresonse length', firstResponse.body.length)
  console.log('secondresonse length', secondResponse.body.length)

})

test('blogs can be added ', async () => {
  const firstResponse = await api.get('/api/blogs')
  const newBlog = {
    'title': 'testing backend',
    'author': 'fullStackOpen',
    'url': 'fso.com',
    'likes': 96334
  }

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const secondResponse = await api.get('/api/blogs')

  const contents = secondResponse.body.map(r => r.title)
  expect(secondResponse.body).toHaveLength(firstResponse.body.length + 1)
  expect(contents).toContain(
    'testing backend')
  console.log('contents', contents)
  console.log('firstresonse length', firstResponse.body.length)
  console.log('secondresonse length', secondResponse.body.length)

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

  const response = await api.get('/api/blogs')

  const lastBlog = response.body.slice(-1)[0]
  expect(lastBlog.likes).toBe(0)
})










afterAll(async () => {
  await mongoose.connection.close()
})
