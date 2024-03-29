const blogsRouter = require('express').Router()
const Blog =  require('../models/blog')
const { userExtractor } = require('../utils/middleware')


blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog
    .find({}).populate('user', { username: 1, name: 1 })

  response.json(blogs)
})

blogsRouter.post('/', userExtractor, async (request, response) => {
  const { title, author, url, likes } = request.body
  const user = request.user

  const blog = new Blog({
    title, author, url, likes,
    user: user._id
  })

  const savedBlog = await blog.save()
  user.blogs = user.blogs.concat(savedBlog._id)
  await user.save()

  const savedBlogWithUser = await savedBlog.populate('user', { username: 1, name: 1 })

  response.status(201).json(savedBlogWithUser)
})

blogsRouter.delete('/:id', userExtractor, async (request, response) => {
  const user = request.user
  const blog = await Blog.findById(request.params.id)

  if (!blog) {
    response.status(204).end()
  }

  if (blog.user.toString() !== user._id.toString()) {
    response.status(401).json({ error: 'blog not created by the user' })
  }

  await Blog.findByIdAndDelete(request.params.id)
  response.status(204).end()
})

blogsRouter.put('/:id', async (request, response) => {
  const updatedBlog = await Blog.findByIdAndUpdate(
    request.params.id,
    request.body,
    { new:true, runValidators: true, context: 'query' }
  ).populate('user', { username: 1, name: 1 })


  response.json(updatedBlog)
})

module.exports = blogsRouter