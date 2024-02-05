import axios from 'axios'

const baseUrl = '/api/blogs'

const setAuthorizationHeader = (token) => {
  return {
    headers: {
      Authorization: `Bearer ${token}`
    }
  }
}

const getAll = async (token) => {

  const response = await axios.get(baseUrl, setAuthorizationHeader(token))
  return response.data
}

const getBlogById = async (token, blogId) => {
  const url = `${baseUrl}/${blogId}`

  const response = await axios.get(url, setAuthorizationHeader(token))
  return response.data
}

const createBlog = async (token, newBlog) => {

  const response = await axios.post(baseUrl, newBlog, setAuthorizationHeader(token))
  return response.data
}

const updateLikes = async (token, blogId, updateLikes) => {
  const url = `${baseUrl}/${blogId}`

  const response = await axios.put(
    url,
    { likes: updateLikes },
    {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    }
  )

  return response.data
}

const deleteBlog = async (token, blogId) => {
  const url = `${baseUrl}/${blogId}`

  try {
    const response = await axios.delete(url, setAuthorizationHeader(token))
    return response.data
  } catch (error) {
    console.error('error deleting blog', error)
  }
}


export default {
  getAll,
  createBlog,
  updateLikes,
  getBlogById,
  deleteBlog
}