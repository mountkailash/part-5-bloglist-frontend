import React from 'react'
import '../index.css'


const Notification = ({ message, notification }) => {
  
  if (message) {
    return (
      <div className='error'>
        {message}
      </div>
    )
  }

  if (notification) {
    return (
      <div className='notificationStyle'>
        {notification}
      </div>
    )
  }

  return null
}


export default Notification