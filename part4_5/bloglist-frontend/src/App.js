import { useState, useEffect, useRef } from 'react'
import blogService from './services/blogs'
import loginService from './services/login'
import Blog from './components/Blog'
import BlogForm from './components/BlogForm'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [user, setUser] = useState(null)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [errorMessage, setErrorMessage] = useState(null)

  const blogFormRef = useRef()

  const sortingFunction = (a, b) => b.likes - a.likes

  const showError = message => {
    setErrorMessage(message)
    setTimeout(() => {
      setErrorMessage(null)
    }, 5000)
  }

  useEffect(() => {
    blogService.getAll().then(blogs => {
      setBlogs(blogs.sort(sortingFunction))
    })
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBloglistUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      blogService.setToken(user.token)
      setUser(user)
    }
  }, [])

  const handleLogin = async (event) => {
    event.preventDefault()
    console.log(username, password)

    try {
      const user = await loginService.login({
        username, password
      })

      window.localStorage.setItem(
        'loggedBloglistUser', JSON.stringify(user)
      )
      blogService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')

    } catch (exception) {
      showError('Wrong credentials')
    }
  }

  const handleLogout = () => {
    window.localStorage.removeItem('loggedBloglistUser')
    setUser(null)
  }

  const addBlog = async newBlog => {
    blogFormRef.current.toggleVisibility()
    try {
      const returnedBlog = await blogService.create(newBlog)
      setBlogs(
        blogs
          .concat(returnedBlog)
          .sort(sortingFunction)
      )
    } catch (e) {
      showError(e.response.data.error)
    }
  }

  const likeBlog = async blog => {
    const likedBlog = { ...blog, likes: blog.likes + 1, user: blog.user.id }

    try {
      const updatedBlog = await blogService.update(likedBlog.id, likedBlog)
      setBlogs(
        blogs
          .map(blog => blog.id === updatedBlog.id ? updatedBlog : blog)
          .sort(sortingFunction)
      )
    } catch (e) {
      showError(e.response.data.error)
    }
  }

  const removeBlog = async blog => {
    const blogId = blog.id

    if (window.confirm(`Remove blog ${blog.title} by ${blog.author}`)){
      try {
        await blogService.remove(blogId)
        setBlogs(
          blogs
            .filter(blog => blog.id !== blogId)
        )
      } catch (e) {
        showError(e.response.data.error)
      }
    }
  }

  if (user === null) {
    return (
      <div>
        <h2>Log in to application</h2>
        {errorMessage && <p>ERROR: {errorMessage}</p>}
        <form onSubmit={handleLogin}>
          <div>
            username
            <input
              type="text"
              name="username"
              value={username}
              onChange={({ target }) => setUsername(target.value)}
            />
          </div>
          <div>
            password
            <input
              type="password"
              name="password"
              value={password}
              onChange={({ target }) => setPassword(target.value)}
            />
          </div>
          <button type="submit">login</button>
        </form>
      </div>
    )
  } else {
    return (
      <div>
        <h2>Blogs</h2>
        {errorMessage && <p>ERROR: {errorMessage}</p>}
        <p>{user.name} logged in <button onClick={handleLogout}>logout</button></p>
        <BlogForm createBlog={addBlog} ref={blogFormRef}/>
        <div>
          {blogs.map(blog =>
            <Blog key={blog.id} blog={blog} likeBlog={likeBlog} removeBlog={removeBlog} username={user.username} />)}
        </div>
      </div>
    )
  }
}

export default App
