const _ = require('lodash')

const dummy = (blogs) => {
  return 1
}

const totalLikes = (blogs) => {
  return blogs.reduce((acc, blog) => acc + blog.likes, 0)
}

const favoriteBlog = (blogs) => {
  if (blogs.length === 0) return undefined

  const favorite = blogs.reduce((acc, blog) => {
    if (!acc || acc.likes < blog.likes) {
      return blog
    } else {
      return acc
    }
  }, null)

  return {
    title: favorite.title,
    author: favorite.author,
    likes: favorite.likes
  }
}

const mostBlogs = (blogs) => {
  const blogsPerAuthor =  _(blogs)
    .countBy('author')
    .map((blogs, author) => {
      return {
        author: author,
        blogs: blogs
      }
    })
    .value()

  return _.maxBy(blogsPerAuthor, 'blogs')
}

const mostLikes = (blogs) => {
  const blogsPerAuthor =  _(blogs)
    .groupBy('author')
    .map((blogs, author) => {
      return {
        author: author,
        likes: _.sumBy(blogs, 'likes')
      }
    })
    .value()

  return _.maxBy(blogsPerAuthor, 'likes')
}


module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes
}