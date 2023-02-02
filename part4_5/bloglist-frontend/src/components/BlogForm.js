import { useState, forwardRef, useImperativeHandle } from 'react'
import PropTypes from 'prop-types'

const BlogForm = forwardRef(({ createBlog }, refs) => {
  const [visible, setVisible] = useState(false)

  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')

  const hideWhenVisible = { display: visible ? 'none' : '' }
  const showWhenVisible = { display: visible ? '' : 'none' }

  const toggleVisibility = () => {
    setVisible(!visible)
  }

  useImperativeHandle(refs, () => ({ toggleVisibility }))


  const addBlog = (event) => {
    event.preventDefault()
    createBlog({
      title, author, url
    })

    setTitle('')
    setAuthor('')
    setUrl('')
  }

  return (
    <>
      <div style={hideWhenVisible}>
        <button onClick={toggleVisibility}>new blog</button>
      </div>
      <div style={showWhenVisible}>
        <h3>create new</h3>
        <form onSubmit={addBlog}>
          <div>
            title
            <input
              type="text"
              name="title"
              value={title}
              onChange={({ target }) => setTitle(target.value)}
            />
          </div>
          <div>
            author
            <input
              type="text"
              name="author"
              value={author}
              onChange={({ target }) => setAuthor(target.value)}
            />
          </div>
          <div>
            url
            <input
              type="text"
              name="url"
              value={url}
              onChange={({ target }) => setUrl(target.value)}
            />
          </div>
          <button type="submit">create</button>
        </form>
        <button onClick={toggleVisibility}>cancel</button>
      </div>
    </>
  )
})

BlogForm.displayName = 'BlogForm'

BlogForm.propTypes = {
  createBlog: PropTypes.func.isRequired
}

export default BlogForm