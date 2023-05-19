import React from 'react'
import { Link } from 'react-router-dom'

const Footer = () => {
  return (
    <div className='footer'>
       <h4 className='text-center pt-2'>All Rights reserved &copy; </h4> 
       <p className='text-center mt-2'>
        <Link to="/about">About</Link>|<Link to="/contact">Contact</Link>|
        <Link to="/policy">Policy</Link>
       </p>
    </div>
  )
}

export default Footer