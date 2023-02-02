const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const supertest = require('supertest')
const helper = require('./test_helper')
const app = require('../app')
const api = supertest(app)

const Blog = require('../models/blog')
const User = require('../models/user')

let token
let user

beforeAll(async () => {
  await User.deleteMany({})

  const passwordHash = await bcrypt.hash('password', 10)
  user = new User({ username: 'root', passwordHash })
  user = await user.save()

  const userForToken = {
    username: user.username,
    id: user._id
  }
  token = jwt.sign(userForToken, process.env.SECRET)
})

beforeEach(async () => {
  await Blog.deleteMany({})
  await Blog.insertMany(helper.initialBlogs.map(blog => ({ ...blog, user: user._id })))
})

describe('when using GET', () => {
  test('correct amount of blogs are returned as json', async () => {
    const response = await api.get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)

    expect(response.body).toHaveLength(helper.initialBlogs.length)
  })

  test('id property is defined', async () => {
    const response = await api.get('/api/blogs')
    const firstBlog = response.body[0]
    expect(firstBlog.id).toBeDefined()
  })
})

describe('when adding using POST with valid token',  () => {
  test('new blog is successfully added', async () => {
    await api
      .post('/api/blogs')
      .send(helper.newBlog)
      .set('Authorization', `Bearer ${token}`)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const blogsAtEnd = await helper.blogsInDb()
    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length + 1)

    const titles = blogsAtEnd.map(blog => blog.title)
    expect(titles).toContain(helper.newBlog.title)
  })

  test('new blog without likes is added with likes:0', async () => {
    const newBlog = { ...helper.newBlog }
    delete newBlog.likes

    await api
      .post('/api/blogs')
      .send(newBlog)
      .set('Authorization', `Bearer ${token}`)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const blogsAtEnd = await helper.blogsInDb()
    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length + 1)

    const addedBlog = blogsAtEnd.filter(blog => blog.title === newBlog.title)[0]
    expect(addedBlog.likes).toBe(0)
  })

  test('new blog without title or url returns 400', async () => {
    const newBlogWithoutTitle = { ...helper.newBlog }
    delete newBlogWithoutTitle.title
    const newBlogWithoutUrl = { ...helper.newBlog }
    delete newBlogWithoutUrl.url

    await api
      .post('/api/blogs')
      .send(newBlogWithoutTitle)
      .set('Authorization', `Bearer ${token}`)
      .expect(400)
    await api
      .post('/api/blogs')
      .send(newBlogWithoutUrl)
      .set('Authorization', `Bearer ${token}`)
      .expect(400)
  })
})

describe('when adding using POST without token', () => {
  test('new blog is not added', async () => {
    await api
      .post('/api/blogs')
      .send(helper.newBlog)
      .expect(401)

    const blogsAtEnd = await helper.blogsInDb()
    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length)

    const titles = blogsAtEnd.map(blog => blog.title)
    expect(titles).not.toContain(helper.newBlog.title)
  })
})

describe('when using DELETE with valid token', () => {
  test('blog is deleted', async () => {
    const blogsAtStart = await helper.blogsInDb()
    const id = blogsAtStart[0].id

    await api
      .delete(`/api/blogs/${id}`)
      .set('Authorization', `Bearer ${token}`)

    const blogsAtEnd = await helper.blogsInDb()

    expect(blogsAtEnd.length).toBe(blogsAtStart.length - 1)
    expect(blogsAtEnd.map(blog => blog.title)).not.toContain(blogsAtStart[0].title)
  })
})

describe('when using PUT', () => {
  test('blog is updated', async () => {
    const blogsAtStart = await helper.blogsInDb()
    const id = blogsAtStart[0].id

    const response = await api
      .put(`/api/blogs/${id}`)
      .send(helper.newBlog)

    const blogsAtEnd = await helper.blogsInDb()

    expect(response.body.likes).toEqual(helper.newBlog.likes)
    expect(blogsAtEnd.map(blog => blog.title)).not.toContain(blogsAtStart[0].title)
  })
})

afterAll(() => {
  mongoose.connection.close()
})