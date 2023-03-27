const Blog = require('../models/blog')
const User = require('../models/user')

const initialBlogs = [
  {
    'title': 'how to test backend',
    'author': 'fullStackOpen',
    'url': 'fso.com',
    'likes': 96405,
    'id': '6417dc934e4784ec2c0f2004'
  },
  {
    'title': 'how to test logs',
    'author': 'fullStackOpen',
    'url': 'fso.com',
    'likes': 964,
    'id': '6417dcf35a7023cb1f647986'
  },
  {
    'title': 'how to test modules',
    'author': 'fullStackOpen',
    'url': 'fso.com',
    'likes': 9634,
    'id': '64184c438f0d84a238d26128'
  },
  {
    'title': 'testing backend',
    'author': 'fullStackOpen',
    'url': 'fso.com',
    'likes': 96334,
    'id': '641b5ce4313f6d7164824291'
  },
]

const usersInDb = async () => {
  const users = await User.find({})
  return users.map(u => u.toJSON())
}

const nonExistingId = async () => {
  const blog = new Blog({ title: 'this has id but it gets removed from db' })
  await blog.save()
  await blog.deleteOne()

  return blog._id.toString()
}

const blogsInDb = async () => {
  const blogs = await Blog.find({})
  return blogs.map(blog => blog.toJSON())
}

module.exports = {
  initialBlogs, nonExistingId, blogsInDb, usersInDb
}
