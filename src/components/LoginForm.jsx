import React from 'react'
import PropTypes from 'prop-types'

const LoginForm = ({ username, password, handleUserNameChange, handlePasswordChange, handleLogin }) => {


  LoginForm.prototypes = {
    username: PropTypes.string.isRequired,
    password: PropTypes.string.isRequired,
    handleUserNameChange: PropTypes.func.isRequired,
    handlePasswordChange: PropTypes.func.isRequired,
    handleLogin: PropTypes.func.isRequired
  }

  return (
    <div>
      <h1>log in to application</h1>


      <form onSubmit={handleLogin}>
        <div>
                    username
          <input
          id='username'
            type='text'
            name='Username'
            value={username}
            onChange={handleUserNameChange}
          />
        </div>
        <div>
                    password
          <input
          id='password'
            type='password'
            name='Password'
            value={password}
            onChange={handlePasswordChange}
          />
        </div>
        <button id='login-button' type='submit'>login</button>
      </form>
    </div>
  )
}

export default LoginForm