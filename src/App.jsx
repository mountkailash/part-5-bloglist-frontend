import { useState, useEffect } from 'react'
import loginService from './services/login'
import blogService from './services/blogs'

import Blog from './components/Blog'
import axios from 'axios'
import LoginForm from './components/LoginForm'
import BlogForm from './components/BlogForm'
import Togglable from './components/Togglable'
import Notification from './components/Notification'


const App = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [blogs, setBlogs] = useState([])
  const [displayMessage, setDisplayMessage] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  // const [detailsVisible, setDetailsVisible] = useState(false)

  // const toggleDetails = () => {
  //   setDetailsVisible(!detailsVisible)
  // }



  const displayNotification = (notification) => {
    setDisplayMessage(notification)
    setTimeout(() => {
      setDisplayMessage(null)
    }, 5000)
  }

  const displayError = (message) => {
    setErrorMessage(message)
    setTimeout(() => {
      setErrorMessage(null)
    }, 5000)
  }



  const handleLogin = async (event) => {
    event.preventDefault()
    console.log('logging in with', username, password)

    try {
      const user = await loginService.login({
        username, password
      })
      setUser(user)
      console.log(user)
      setUsername('')
      setPassword('')
      // saving the token in the local storage
      localStorage.setItem('loggedBlogAppUser', JSON.stringify(user))
    } catch (error) {
      setErrorMessage('wrong username or password')
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    }
  }

  const handleLogout = () => {
    setUser(null)
    localStorage.removeItem('loggedBlogAppUser')
  }

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const token = user.token
        const allBlogs = await blogService.getAll(token)

        // Filter the blogs to show only those created by the logged-in user
        const userBlogs = allBlogs.filter(blog => blog.user.id === user.id)
        setBlogs(userBlogs)
      } catch (error) {
        setErrorMessage('Error fetching blogs', error)
        setTimeout(() => {
          setErrorMessage(null)
        }, 5000)
      }
    }

    if (user) {
      fetchBlogs()
    }
  }, [user])

  const updateBlogs = async () => {
    try {
      const blogs = await blogService.getAll(user.token)
      setBlogs(blogs)
    } catch (error) {
      setErrorMessage('Error fetching blogs', error)
    }
  }

  // sorting the blogs based on the likes of the blog
  const sortedBlog = [...blogs].sort((a, b) => b.likes - a.likes)

  const updateBlogAfterDeletion = async () => {
    const updatedBlogs = await blogService.getAll(user.token)
    setBlogs(updatedBlogs)
  }


  const loginForm = () => (
    <div>
      <Togglable buttonLabel='login'>
        <LoginForm
          username={username}
          password={password}
          handleUserNameChange={({ target }) => setUsername(target.value)}
          handlePasswordChange={({ target }) => setPassword(target.value)}
          handleLogin={handleLogin}
        />
      </Togglable>
    </div>
  )


  const blogForm = () => (
    <div style={{ margin: '20px' }}>
      <Togglable buttonLabel='create blog'>
        <div>
          <h2>Create new</h2>
        </div>
        <BlogForm
          updateBlogs={updateBlogs}
          user={user}
          displayNotification={displayNotification}
          displayError={displayError}
        />
      </Togglable>
    </div>
  )


  return (
    <div style={{ marginTop: '20px' }}>
      {/* <Notification message={errorMessage} /> */}

      {!user ? (
        
        // show login form if user is not logged in
        <div style={{ margin: '20px' }}>
          <Notification message={errorMessage} />
          {loginForm()}
        </div>
      ) : (
        // show blog related components if user is logged in
        <div>
          <h2 style={{ margin: '20px' }}>blogs</h2>
          <Notification message={errorMessage} notification={displayMessage} />
          {user &&
            <p style={{ margin: '20px' }}>{user.name} logged in <button onClick={handleLogout}>Logout</button></p>
          }

          {blogForm()}

          <div style={{ margin: '20px' }}>
            {sortedBlog.map(blog =>
              <Blog key={blog.id} blog={blog} user={user} updateOnDelete={updateBlogAfterDeletion} />
            )}
          </div>
        </div>
      )}

    </div>
  )

}

export default App
