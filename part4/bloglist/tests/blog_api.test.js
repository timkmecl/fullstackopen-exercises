const mongoose = require('mongoose')
const supertest = require('supertest')
const helper = require('./test_helper')
const app = require('../app')
const api = supertest(app)

const Blog = require('../models/blog')



beforeEach(async () => {
  await Blog.deleteMany({})
  await Blog.insertMany(helper.initialBlogs)
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

describe('when adding using POST',  () => {
  test('new blog is successfully added', async () => {
    await api
      .post('/api/blogs')
      .send(helper.newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const notesAtEnd = await helper.blogsInDb()
    expect(notesAtEnd).toHaveLength(helper.initialBlogs.length + 1)

    const titles = notesAtEnd.map(blog => blog.title)
    expect(titles).toContain(helper.newBlog.title)
  })

  test('new blog without likes is added with likes:0', async () => {
    const newBlog = { ...helper.newBlog }
    delete newBlog.likes

    await api
      .post('/api/blogs')
      .send(newBlog)
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
      .expect(400)
    await api
      .post('/api/blogs')
      .send(newBlogWithoutUrl)
      .expect(400)
  })
})

describe('when using DELETE', () => {
  test('blog is deleted', async () => {
    const blogsAtStart = await helper.blogsInDb()
    const id = blogsAtStart[0].id

    await api.delete(`/api/blogs/${id}`)

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
    const firstBlogAtEnd = blogsAtEnd.filter(blog => blog.id === id)[0]

    expect(response.body).toEqual(firstBlogAtEnd)
    expect(response.body.likes).toEqual(helper.newBlog.likes)
    expect(blogsAtEnd.map(blog => blog.title)).not.toContain(blogsAtStart[0].title)
  })
})

afterAll(() => {
  mongoose.connection.close()
})