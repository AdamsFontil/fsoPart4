const bcrypt = require('bcrypt')
const signupRouter = require('express').Router()
const User = require('../models/user')

signupRouter.post('/', async (request, response) => {
  console.log('signup router')
  const { username, name, password } = request.body

  if (!password || !username) {
    return response.status(402).json({ error: 'password and username are required, please provide them' })
  } else if (password.length < 3 || username.length < 3) {
    return response.status(403).json({ error: 'password and username must be more than 3 characters' })
  }

  const saltRounds = 10
  const passwordHash = await bcrypt.hash(password, saltRounds)

  const user = new User({
    username,
    name,
    passwordHash,
  })

  const savedUser = await user.save()

  response.status(201).json(savedUser)
})
