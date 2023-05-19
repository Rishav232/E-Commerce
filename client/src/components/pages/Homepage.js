import React, { useState, useEffect } from 'react'
import Layout from '../Layout/Layout'
import axios from 'axios';
import { Checkbox, Radio } from 'antd';
import { Prices } from './Prices';
import { useNavigate } from 'react-router-dom';
import "../../styles/Homepage.css"
const Homepage = () => {
  
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [checked, setChecked] = useState([]);
  const [price, setprice] = useState([])
  const [page, setPage] = useState(1);
  const [totalResults, setTotalResults] = useState(0);
  const [loading, setLoading] = useState(false);
  //get Products
  const getProducts = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(`http://localhost:80/api/product/products-limit/${page}`);
      setLoading(false);
      setProducts(data.product);

    } catch (error) {
      console.log(error);

    }
  }
  //totalResults
  const getTotal = async () => {
    try {
      const { data } = await axios.get("http://localhost:80/api/product/totalResults");
      if (data.success)
        setTotalResults(data.TotalResults);
    } catch (error) {
      console.log(error);

    }
  }
  useEffect(() => {
    if (!checked.length && !price.length) {
      getProducts();

    }
    // eslint-disable-next-line
  }, [checked.length, price.length])


  //get category
  const getCategory = async () => {
    try {
      const { data } = await axios.get("http://localhost:80/api/category/getAllcategory");


      setCategories(data.allCategory);


    } catch (error) {
      console.log(error);
    }
  }
  useEffect(() => {
    getCategory();
    getTotal();
    // eslint-disable-next-line
  }, [])

  //filtering the product
  const handleFilter = (value, id) => {
    let all = [...checked];
    if (value) {
      all.push(id);
    }
    else {
      all = all.filter(c => c !== id)
    }
    setChecked(all);
  }

  const FilterProduct = async () => {
    try {
      // setPage(1);
      const { data } = await axios.post("http://localhost:80/api/product/filter-product", { checked, price });
      if (data?.success)
        setProducts(data.product);
    } catch (error) {
      console.log(error);
    }
  }
  useEffect(() => {
    if (checked.length > 0 || price.length > 0)
      FilterProduct();
    // eslint-disable-next-line
  }, [checked, price])
  const handleLoad = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(`http://localhost:80/api/product/products-limit/${page}`)
      if (data?.success) {
        setProducts([...products, ...data?.product]);
      }
      setLoading(false);
    } catch (error) {
      console.log(error);
    }
  }
  useEffect(() => {
    if (page === 1)
      return;
    handleLoad();
    // eslint-disable-next-line
  }, [page])

  return (
    <>
      <Layout title="E-Commerce-Home">
        <img className="banner" src="Banner.JPG" alt="Banner" width={"100%"} />
        <div className="container-fluid row mt-3 home">
          <div className="col-md-3 filter">
            <h4 className="text-center">Filter By Category</h4>
            <div className="d-flex flex-column">
              {categories.map(c => {
                return <Checkbox key={c._id} onChange={(e) => handleFilter(e.target.checked, c._id)}>
                  {c.name}
                </Checkbox>
              })}
            </div>
            <h4 className="text-center">Filter By Price</h4>
            <div className="d-flex flex-column">
              <Radio.Group onChange={(e) => { setprice(e.target.value) }}>
                {Prices.map(p => {
                  return <div key={p._id}>
                    <Radio value={p.array}>
                      {p.name}
                    </Radio>
                  </div>
                })}
              </Radio.Group>
            </div>
            <button className='btn btn-danger' onClick={() => { window.location.reload() }}>RESET FILTERS</button>
          </div>
          <div className="col-md-9 ">
            <h1 className="text-center">All Products</h1>
            <div className="d-flex flex-wrap">
              {products.length ? (products?.map(p => {
                return <div key={p._id} className="card m-2" style={{ width: '18rem' }}>
                  <img src={`http://localhost:80/api/product/Product-Photo/${p._id}`}
                    height={"300px"}
                    className="card-img-top" alt="Nothing to display" />
                  <div className="card-body">
                    <div className="card-name-price">
                      <h5 className="card-title">{p.name}</h5>
                      <h5 className="card-price">Rs {p.price.toLocaleString('en-IN', {
                      style: "currency",
                      currency: "INR"
                    })}</h5>
                    </div>
                    <p className="card-text">{p.description.substring(0, 10)}...</p>

                    <div>
                      <button className="btn btn-primary ms-1 details" onClick={() => navigate(`/product/${p.slug}`)}>More Details</button>
                    </div>

                  </div>
                </div>
              })) : (
                <h1 className='text-center'>Nothing to Display</h1>
              )}
            </div>
            <div className="mt-2 p-2 ">
              {products.length > 0 && products.length < totalResults
                && (
                  <button className='btn btn-warning loadmore' onClick={(e) => { e.preventDefault(); setPage(page + 1) }}>
                    {loading ? "Loading...." : "LoadMore"}
                  </button>
                )}
            </div>
          </div>
        </div>
      </Layout>

    </>
  )
}

export default Homepage