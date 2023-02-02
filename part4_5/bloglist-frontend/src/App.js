import { useState, useEffect } from 'react'
import blogService from './services/blogs'
import loginService from './services/login'
import Blog from './components/Blog'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [user, setUser] = useState(null)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [errorMessage, setErrorMessage] = useState(null)
  const [newTitle, setNewTitle] = useState('')
  const [newAuthor, setNewAuthor] = useState('')
  const [newUrl, setNewUrl] = useState('')

  useEffect(() =>{
    blogService.getAll().then(blogs => {
      setBlogs(blogs)
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
      setErrorMessage('Wrong credentials')
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    }
  }

  const handleLogout = () => {
    window.localStorage.removeItem('loggedBloglistUser')
    setUser(null)
  }

  const addBlog = async event => {
    event.preventDefault()

    try {
      const returnedBlog = await blogService
        .create({
          title: newTitle,
          author: newAuthor,
          url: newUrl
        })
  
      setBlogs(blogs.concat(returnedBlog))
      setNewTitle('')
      setNewAuthor('')
      setNewUrl('')
    } catch (e) {
      setErrorMessage(e.response.data.error)
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
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
        <h3>create new</h3>
        <form onSubmit={addBlog}>
          <div>
            title
            <input 
              type="text" 
              name="title" 
              value={newTitle}
              onChange={({ target }) => setNewTitle(target.value)}
            />
          </div>
          <div>
            author
            <input 
              type="text" 
              name="author" 
              value={newAuthor}
              onChange={({ target }) => setNewAuthor(target.value)}
            />
          </div>
          <div>
            url
            <input 
              type="text" 
              name="url" 
              value={newUrl}
              onChange={({ target }) => setNewUrl(target.value)}
            />
          </div>
          <button type="submit">create</button>
        </form>
        <div>
          {blogs.map(blog => 
            <Blog key={blog.id} blog={blog} />)}
        </div>
      </div>
    );
  }
}

export default App;
