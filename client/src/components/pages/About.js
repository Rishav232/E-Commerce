import React from 'react'
import Layout from '../Layout/Layout'

const About = () => {
  return (
    <Layout title="About E-Commerce">
      <div className='row contactus'>
        <div className="col-md-6">
          <img src="https://cdn.shopify.com/s/files/1/0317/8397/files/about_banner2.jpg?10644745255139821616"
            alt="contactus" style={{ width: "100%" }} />
        </div>
        <div className="col-md-4 ">
          <p className='text-dark text-center'>Lorem ipsum dolor sit amet consectetur adipisicing elit. Fugiat, aperiam aut cum hic voluptatibus aliquam. Voluptatibus enim et suscipit doloribus, quidem repellat recusandae, ut eos laborum nesciunt fugiat nisi tempore.</p>
        </div>
      </div>
    </Layout>
  )
}

export default About