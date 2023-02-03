import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import BlogForm from './BlogForm'

const blog = {
  title: 'Blog Title',
  author: 'Blog Author',
  url: 'example.com'
}

describe('<BlogForm />', () => {
  test('event handler called with the right details', async () => {
    const user = userEvent.setup()
    const createBlog = jest.fn()

    const container = render(<BlogForm createBlog={createBlog} />).container

    const sendButton = screen.getByText('create')
    const inputTitle = container.querySelector('input[name="title"]')
    const inputAuthor = container.querySelector('input[name="author"]')
    const inputUrl = container.querySelector('input[name="url"]')

    await user.type(inputTitle, blog.title)
    await user.type(inputAuthor, blog.author)
    await user.type(inputUrl, blog.url)
    await user.click(sendButton)

    expect(createBlog.mock.calls).toHaveLength(1)
    expect(createBlog.mock.calls[0][0]).toEqual(blog)
  })
})