import React, { useEffect, useState } from 'react'
import Layout from '../../Layout/Layout'
import axios from 'axios';
import { Link, useParams } from 'react-router-dom';
import "../../../styles/AuthCategory.css"
const CategoriesList = () => {
  const [products, setproducts] = useState([]);
  const [category, setCategory] = useState([]);

  const params = useParams();
  const getCategory = async () => {
    try {
      const { data } = await axios.get(`http://localhost:80/api/category/getSinglecategory/${params.slug}`);
      setCategory(data?.category);
      getProductsbyCategory(data.category[0]._id);

    } catch (error) {
      console.log(error);
    }
  }
  const getProductsbyCategory = async (cid) => {
    try {
      const { data } = await axios.get(`http://localhost:80/api/product/productCategory/${cid}`)
      // console.log(data);
      if (data?.success)
        setproducts(data.products)
    } catch (error) {
      console.log(error);
    }
  }
  useEffect(() => {
    if (params?.slug)
      getCategory();
    // eslint-disable-next-line
  }, [params?.slug])
  return (
    <Layout title={category[0]?.name}>
      <div className="container mt-3 category">
        <h4 className='text-center'>Category - {category[0]?.name}</h4>
        <h6 className='text-center'>{products?.length} results found</h6>
        <div className="d-flex flex-wrap offset-1">
          {products?.map(p => {
            return <Link key={p._id} to={`/product/${p.slug}`} className='product-list'>
              <div className="card m-2" style={{ width: '18rem' }}>
                <img src={`http://localhost:80/api/product/Product-Photo/${p._id}`} className="card-img-top" alt="Nothing to display" height={"300px"} />
                <div className="card-body">
                  <div className="card-name-price">
                    <h5 className="card-title">{p.name}</h5>
                    <h5 className="card-title card-price">{p.price.toLocaleString('en-IN', {
                      style: "currency",
                      currency: "INR"
                    })}</h5>
                  </div>
                  <p className="card-text">{p.description.substring(0, 20)}...</p>
                </div>
              </div>
            </Link>
          })}
        </div>
      </div>
    </Layout>
  )
}

export default CategoriesList