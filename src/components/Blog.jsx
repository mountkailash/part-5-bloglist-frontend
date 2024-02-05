
import { useEffect, useState } from 'react'
import blogService from '../services/blogs'


const Blog = ({ blog, user, updateOnDelete }) => {
  const [detailsVisible, setDetailsVisible] = useState(false)
  const [blogLikes, setBlogLikes] = useState(blog.likes)
  // const [liked, setLiked] = useState(false)

  const toggleDetails = () => {
    setDetailsVisible(!detailsVisible)
  }


  const handleLikesCLick = async () => {
    const token = user.token
    console.log(token)
    const id = blog.id
    console.log(id)
    // const updatedLikes = liked ? blogLikes - 1 : blogLikes + 1
    const updatedLikes = blogLikes + 1
    console.log('updated likes', updatedLikes)

    const updatedBlogLikes = await blogService.updateLikes(token, id, updatedLikes)
    console.log('updated blog likes', updatedBlogLikes)
    // setLiked(!liked)

    const updatedBlog = await blogService.getBlogById(token, id)
    console.log('the new updated value', updatedBlog.likes)
    setBlogLikes(updatedBlog.likes)

  }

  const handleDeleteBlog = async () => {
    const token = user.token
    console.log(token)
    const id = blog.id
    console.log(id)

    const deleteBlog = blog.id !== id

    window.confirm(`Remove blog ${blog.title} by ${blog.author}`)

    if (confirm) {
      const updateDelete = await blogService.deleteBlog(token, id, deleteBlog)
      console.log('deleting the blog', updateDelete.id)
    }

    updateOnDelete()
  }

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  return (
    <div style={blogStyle} className='blog'>
      {blog.title} {blog.author}
      <button onClick={toggleDetails}>
        {detailsVisible ? 'Hide' : 'View'}
      </button>
      {detailsVisible && (
        <div>
          <p>
            {blog.url}
          </p>
          <p className='blog-likes'>
            likes {blogLikes}
            <button
              onClick={handleLikesCLick}
              >
              like
            </button>
          </p>
          <p>
            {user.name}
          </p>
          <button
            onClick={handleDeleteBlog}>
            remove
          </button>
        </div>
      )
      }

    </div>
  )
}

export default Blog