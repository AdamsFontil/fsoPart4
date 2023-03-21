
const dummy = (blogs) => {
  console.log('test dummy blogs...',blogs[0])
  return 1
}

const totalLikes = (blogs) => {
  console.log('testing totalLikes...')
  let totalLikes = 0
  blogs.forEach(blog => {
    console.log(`${blog.likes} likes`)
    totalLikes+= blog.likes
  })
  return totalLikes
}

const favoriteBlog = (blogs) => {
  console.log('testing favoriteBlog...')
  let mostLikes = 0
  let favoriteBlog = {}
  blogs.forEach(blog => {
    if (blog.likes > mostLikes) {
      favoriteBlog = blog
      mostLikes= blog.likes
    }
  })
  return favoriteBlog
}

const mostBlogs = (blogs) => {
  console.log('testing mostBlogs...')
  let blogCounts = {}
  if (blogs.length === 0) {
    return []
  }
  blogs.forEach(blog => {
    if (blog.author in blogCounts) {
      blogCounts[blog.author]++
    } else {
      blogCounts[blog.author] = 1
    }
  })
  let mostBlogsAuthor = ''
  let mostBlogsCount = 0
  for (const author in blogCounts) {
    if (blogCounts[author] > mostBlogsCount) {
      mostBlogsAuthor = author
      mostBlogsCount = blogCounts[author]
    }
  }
  return {
    author: mostBlogsAuthor,
    blogs: mostBlogsCount
  }
}

const mostLikes = (blogs) => {
  console.log('testing mostLikes...')
  let totalLikes = {}
  if (blogs.length === 0) {
    return []
  }
  blogs.forEach(blog => {
    if (blog.author in totalLikes) {
      totalLikes[blog.author] += blog.likes
    } else {
      totalLikes[blog.author] = blog.likes
    }
  })
  let mostLikesAuthor = ''
  let mostLikesCount = 0
  for (const author in totalLikes) {
    if (totalLikes[author] > mostLikesCount) {
      mostLikesAuthor = author
      mostLikesCount = totalLikes[author]
    }
  }
  return {
    author: mostLikesAuthor,
    likes: mostLikesCount
  }
}



module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes
}
