import { useState } from 'react'
import PropTypes from 'prop-types'



const Togglable = (props) => {
  const [visible, setVisible] = useState(false)

  const hiddenWhenVisible = { display: visible ? 'none' : '' }
  const showWhenVisible = { display: visible ? '' : 'none' }

  const toggleVisibility = () => {
    setVisible(!visible)
  }

  Togglable.propTypes = {
    buttonLabel: PropTypes.string.isRequired,
    children: PropTypes.node.isRequired
  }


  return (
    <>
      <div style={hiddenWhenVisible}>
        <button onClick={toggleVisibility}>{props.buttonLabel}</button>
      </div>
      <div style={showWhenVisible}>
        {props.children}
        <button onClick={toggleVisibility}>cancel</button>
      </div>
    </>
  )
}

export default Togglable