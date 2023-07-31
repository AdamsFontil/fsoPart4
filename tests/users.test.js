
const supertest = require('supertest')
// const mongoose = require('mongoose')
const helper = require('./test_helper')
const app = require('../app')
const api = supertest(app)
const bcrypt = require('bcrypt')
const User = require('../models/user')

// const Blog = require('../models/blog')

//...

beforeEach(async () => {
  await User.deleteMany({})

  const passwordHash = await bcrypt.hash('sekret', 10)
  const user = new User({ username: 'root', name:'Adams', passwordHash })

  await user.save()
})

describe('when there is initially one user in db', () => {

  test('creation succeeds with a fresh username', async () => {
    const usersAtStart = await helper.usersInDb()
    console.log('start list', usersAtStart)

    const newUser = {
      username: 'mluukkai',
      name: 'Matti Luukkainen',
      password: 'salainen',
    }

    await api
      .post('/api/users')
      .send(newUser)
      .expect(201)
      .expect('Content-Type', /application\/json/)
    console.log('new user',newUser)

    const usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd).toHaveLength(usersAtStart.length + 1)
    console.log('END list', usersAtEnd)

    const usernames = usersAtEnd.map(u => u.username)
    expect(usernames).toContain(newUser.username)
  })
  test('creation fails without a username or password', async () => {
    const usersAtStart = await helper.usersInDb()
    console.log('start list', usersAtStart)

    const noUserName = {
      name: 'Matti Luukkainen',
      password: 'salainen',
    }
    const noPassword = {
      username: 'user',
      name: 'has user'
    }

    await api
      .post('/api/users')
      .send(noUserName)
      .expect(402)
      .expect('Content-Type', /application\/json/)
    console.log('noUsername',noUserName)

    await api
      .post('/api/users')
      .send(noPassword)
      .expect(402)
      .expect('Content-Type', /application\/json/)
    console.log('noPassowrd',noPassword)

    const usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd).toHaveLength(usersAtStart.length)
    console.log('END list', usersAtEnd)
  })
  test('creation fails if password or username is too short', async () => {
    const usersAtStart = await helper.usersInDb()
    console.log('start list', usersAtStart)

    const userTooShort = {
      username: 'm',
      name: 'Matti Luukkainen',
      password: '12345'
    }
    const passTooShort = {
      username: 'user',
      name: 'has user',
      password: '2'
    }

    await api
      .post('/api/users')
      .send(userTooShort)
      .expect(403)
      .expect('Content-Type', /application\/json/)
    console.log('userTooShort',userTooShort)

    await api
      .post('/api/users')
      .send(passTooShort)
      .expect(403)
      .expect('Content-Type', /application\/json/)
    console.log('passTooShort',passTooShort)

    const usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd).toHaveLength(usersAtStart.length)
    console.log('END list', usersAtEnd)
  })

})
