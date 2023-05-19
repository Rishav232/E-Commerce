
import axios from 'axios';
import React, { useState, useEffect, useContext } from 'react'
import { useNavigate, useParams } from 'react-router-dom';
import Layout from '../Layout/Layout';
import "../../styles/AuthProductDetails.css"
import { toast } from 'react-hot-toast';
import noteContext from '../../Context/NoteContext';
const ProductDetails = () => {
  const { cart, setCart } = useContext(noteContext)
  const navigate = useNavigate();
  const params = useParams();
  const [product, setProduct] = useState({})
  const [releatedProducts, setreleatedProducts] = useState([]);
  const getSingleProduct = async () => {
    try {
      const { data } = await axios.get(`http://localhost:80/api/product/getSingleProduct/${params.slug}`);
      setProduct(data.product[0]);
      getRelatedProducts(data.product[0]._id, data.product[0].category._id);
    } catch (error) {
      console.log(error);
    }
  }

  //getreleated
  const getRelatedProducts = async (pid, cid) => {
    try {
      const { data } = await axios.get(`http://localhost:80/api/product/related-products/${pid}/${cid}`);
      setreleatedProducts(data.products);
    } catch (error) {
      console.log(error);
    }

  }
  useEffect(() => {
    if (params?.slug)
      getSingleProduct();
    // eslint-disable-next-line
  }, [params?.slug])

  return (
    <Layout>
      <div className="row container  mt-4 product-details ">
        <div className="col-md-6">
          <img src={product._id ? `http://localhost:80/api/product/Product-Photo/${product._id}` : ""} alt={product.name}
            className='card-img-top'
            height="300px"
            width={"250px"} />
        </div>
        <div className="col-md-6 product-details-info">
          <h2 className='text-center'>Product Details</h2>
          <hr />
          <h6>Name: {product?.name}</h6>
          <h6>Description: {product?.description}</h6>
          <h6>Price: {product?.price?.toLocaleString('en-IN', {
            style: "currency",
            currency: "INR"
          })}</h6>
          <h6>Category: {product?.category?.name}</h6>
          <button className="btn btn-secondary ms-1 cart"
                        onClick={() => {
                          setCart([...cart, product])
                          localStorage.setItem("cart", JSON.stringify([...cart, product]));
                          toast.success("Item Added to Cart")
                        }}>
                        Add to Cart</button>
        </div>
      </div>

      <hr />
      <div className="row mt-2 similar-products">
        <h2 className='ms-2'>Similar Products</h2>
        <div className="d-flex flex-wrap">
          {releatedProducts.length ? (releatedProducts?.map(p => {
            return <div key={p._id} className="card m-2" style={{ width: '18rem' }}>
              <img src={`http://localhost:80/api/product/Product-Photo/${p._id}`} className="card-img-top" alt="Nothing to display" />
              <div className="card-body">
                <div className="card-name-price">
                  <h5 className="card-title">{p.name}</h5>
                  <h5 className="card-text card-price">{p?.price?.toLocaleString('en-IN', {
                      style: "currency",
                      currency: "INR"
                    })}</h5>
                </div>
                <p className="card-text">{p.description.substring(0, 10)}...</p>

                <div className='d-flex flex-wrap'>
                  <button  className="btn btn-primary mt-1" onClick={() => navigate(`/product/${p.slug}`)}>More Details</button>
                </div>

              </div>
            </div>
          })) : (
            <div className="container">
              <h5 className='ms-2 text-center'>Nothing to Display</h5>
            </div>
          )}
        </div>
      </div>

    </Layout>
  )
}

export default ProductDetails