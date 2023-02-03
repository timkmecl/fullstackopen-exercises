import { useState } from 'react'

const Blog = ({ blog, likeBlog, removeBlog, username }) => {
  const [visible, setVisible] = useState('')

  const toggleVisibility = () => {
    setVisible(!visible)
  }

  const showWhenVisible = { display: visible ? '' : 'none' }
  const createdByUser = username === blog.user.username

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    paddingBottom: 5,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  const handleSendLike = () => {
    likeBlog(blog)
  }

  const handleRemove = () => {
    removeBlog(blog)
  }

  return (
    <div style={blogStyle}>
      <div>
        {blog.title} {blog.author} <button onClick={toggleVisibility} className='blogVisibilityBtn'>{visible ? 'hide' : 'show'}</button>
      </div>
      <div style={showWhenVisible} className='details'>
        <p>{blog.url}</p>
        <p>likes {blog.likes} <button onClick={handleSendLike}>like</button></p>
        <p>{blog.user.name}</p>
        {createdByUser && <button onClick={handleRemove}>remove</button>}
      </div>
    </div>
  )
}
export default Blog