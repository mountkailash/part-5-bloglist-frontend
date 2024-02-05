/* eslint-disable no-undef */
import React from 'react'
import '@testing-library/jest-dom'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from '../src/components/Blog'
import BlogForm from '../src/components/BlogForm'
import blogService from '../src/services/blogs'
import { loginUser } from '../utilis/auth'
import axios from 'axios'
import MockAdapter from 'axios-mock-adapter'

// Mock the BlogService and any other dependencies
jest.mock('../src/services/blogs')


test('renders title and author but not url or likes by default', () => {
  const blog = {
    title: 'test blog',
    author: 'ram',
    url: 'https://abc.com',
    likes: 5,
  }

  const component = render(<Blog blog={blog} />)

  //check that title and author are rendered
  expect(component.container).toHaveTextContent(blog.title)
  expect(component.container).toHaveTextContent(blog.author)

  // check that url and likes are not rendered by default
  expect(component.container).not.toHaveTextContent(blog.url)
  expect(component.container).not.toHaveTextContent(blog.likes)
})

test('the blogs url and likes are shown when button is clicked', async () => {
  const blog = {
    title: 'test blog',
    author: 'ram',
    url: 'https://abc.com',
    likes: 5
  }

  const mockHandler = jest.fn()

  const user = { name: 'ram' }

  const component = render(<Blog blog={blog} user={user} toggleDetails={mockHandler} />)

  // const userSetup = userEvent.setup()
  const button = screen.getByText('View')
  await userEvent.click(button)
  console.log(component.container.innerHTML)

  expect(component.container).toHaveTextContent(blog.url)
  expect(component.container).toHaveTextContent(blog.likes)

})

test('likes button is clicked twice', async () => {

  const blog = {
    title: 'test blog',
    author: 'ram',
    url: 'https://abc.com',
    likes: 5
  }
  const mockHandler = jest.fn()
  const blogLikes = jest.fn(); // Mock the setBlogLikes function
  const setBlogLikes = jest.fn()

  const user = { name: 'ram', token: 'testToken' }

  const component = render(<Blog blog={blog} user={user} toggleDetails={mockHandler} blogLikes= {blogLikes} setBlogLikes={setBlogLikes} />)

  const viewButton = screen.getByText('View')
  await userEvent.click(viewButton)

  const likeButton = screen.getByText('like')
  await userEvent.click(likeButton)
  await userEvent.click(likeButton)

  // Expect setBlogLikes to be called twice with the correct values
  expect(blogLikes).toHaveBeenCalledWith(6) // Assuming the likes increase by 1 on click
  expect(blogLikes).toHaveBeenCalledWith(5) // // Assuming the likes decreases by 1 because the user had already liked the blog
  
})

describe('BlogForm', () => {
  test('creates a new blog successfully and check the prop has been called', async () => {
    const updateBlogs = jest.fn()
    const user = { token: 'testToken' }
    const displayNotification = jest.fn()
    const displayError = jest.fn()

    render(
      <BlogForm
        updateBlogs={updateBlogs}
        user={user}
        displayNotification={displayNotification}
        displayError={displayError}
      />
    )

    // Fill in the form inputs
    userEvent.type(screen.getByPlaceholderText('title'), 'Test Title')
    userEvent.type(screen.getByPlaceholderText('author'), 'Test Author')
    userEvent.type(screen.getByPlaceholderText('url'), 'https://test.com')

    // Click the submit button
    userEvent.click(screen.getByText('Create'))

    // Wait for the asynchronous actions to complete
    await waitFor(() => {
      // Expect that the newBlog state is updated correctly
      expect(screen.getByPlaceholderText('title').value).toBe('')
      expect(screen.getByPlaceholderText('author').value).toBe('')
      expect(screen.getByPlaceholderText('url').value).toBe('')
    })

    // check if the updateBlogs function was called
    // expect(updateBlogs).toHaveBeenCalled();
    await waitFor(() => {
      expect(updateBlogs).toHaveBeenCalled()
    })
  })
})


