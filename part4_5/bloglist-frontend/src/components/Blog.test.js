import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'

const blog = {
  title: 'Blog Title',
  author: 'Blog Author',
  url: 'example.com',
  likes: 2,
  user: { name: 'User' }
}

describe('<Blog />', () => {
  test('renders the blog\'s title and author, but does not render its URL or number of likes', async () => {
    const container = render(<Blog blog={blog}/>).container

    const element = screen.getByText(`${blog.title} ${blog.author}`)
    expect(element).toBeDefined()

    const details = container.querySelector('.details')
    expect(details).toHaveStyle('display: none')
  })

  test('the blog\'s URL and number of likes are shown when the button controlling the shown details has been clicked', async () => {
    const user = userEvent.setup()
    const container = render(<Blog blog={blog}/>).container

    const button = container.querySelector('.blogVisibilityBtn')

    await user.click(button)

    const details = container.querySelector('.details')
    expect(details).not.toHaveStyle('display: none')
  })

  test('if the like button is clicked twice, the event handler is called twice', async () => {
    const mockHandler = jest.fn()
    const user = userEvent.setup()
    render(<Blog blog={blog} likeBlog={mockHandler}/>).container

    const button = screen.getByText('like')

    await user.click(button)
    await user.click(button)

    expect(mockHandler.mock.calls).toHaveLength(2)

  })


})