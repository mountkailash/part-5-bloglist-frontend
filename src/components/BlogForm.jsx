import React, { useState } from 'react'
import BlogService from '../services/blogs'

const BlogForm = ({ updateBlogs, user, displayNotification, displayError }) => {
  const [newBlog, setNewBlog] = useState({
    title: '',
    author: '',
    url: '',
  })

  const handleChange = (event) => {
    const { name, value } = event.target

    setNewBlog((prevBlog) => ({
      ...prevBlog,
      [name]: value,
    }))

    // setNewBlog({
    //   ...newBlog,
    //   [name]: value,
    // })
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    try {
      await BlogService.createBlog(user.token, newBlog)

      if (updateBlogs) {
        const blogs = await BlogService.getAll(user.token)
        updateBlogs(blogs)
      }

      setNewBlog({
        title: '',
        author: '',
        url: '',
      })

      displayNotification(`a new blog ${newBlog.title} by ${newBlog.author} added` )

    } catch (error) {
      displayError('Error creating new blog', error)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <div>
        title:
        <input
        id='title'
          type="text"
          name="title"
          placeholder='title'
          value={newBlog.title}
          onChange={handleChange}
        />
      </div>
      <div>
        author:
        <input
        id='author'
          type="text"
          name="author"
          placeholder='author'
          value={newBlog.author}
          onChange={handleChange}
        />
      </div>
      <div>
        url:
        <input
        id='url'
          type="text"
          name="url"
          placeholder='url'
          value={newBlog.url}
          onChange={handleChange}
        />
      </div>
      <div>
        <button id='create-button' type="submit" onSubmit={handleSubmit}>Create</button>
      </div>
    </form>
  )
}

export default BlogForm
