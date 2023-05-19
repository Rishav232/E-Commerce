import React from 'react'
import Layout from '../Layout/Layout'

const Contact = () => {
  return (
    <Layout title="Contact Us">
    <div className='row contactus'>
      <div className="col-md-6">
        <img src="https://www.ecommscience.com/wp-content/uploads/2020/02/banner-9.png" 
        alt="contactus" style={{width:"100%"}}/>
      </div>
      <div className="col-md-4 ">
      <h1 className='bg-dark text-white p-2 text-center'>CONTACT US</h1>
      <p className="text-justify mt-2 text-center">
        Feel free to call anytime 24X7
      </p>
      <p className="mt-3 text-center">
       📧 www.help@ecommerce.com
      </p>
      <p className="mt-3 text-center">
        ☎️ 012-9093210312
      </p>
      </div>
    </div>
    </Layout>
  )
}

export default Contact