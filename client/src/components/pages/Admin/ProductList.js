import React, { useEffect, useState } from 'react'
import AdminMenu from './AdminMenu'
import Layout from '../../Layout/Layout'
import { toast } from 'react-hot-toast';
import axios from 'axios';
import { Link } from 'react-router-dom';

const ProductList = () => {
    const [products, setProducts] = useState([]);
    const getProducts = async () => {
        try {
            const { data } = await axios.get("http://localhost:80/api/product/getAllProducts");
            setProducts(data.products);
        } catch (error) {
            console.log(error);
            toast.error("Something went wrong");
        }
    }
    useEffect(() => {
        getProducts();
        // eslint-disable-next-line
    }, [])

    return (
        <Layout title="Products List">
            <div className="container-fluid m-3 p-3">
                <div className="row">
                    <div className="col-md-3">
                        <AdminMenu />
                    </div>
                    <div className="col-md-9">
                        <h1 className='text-center'>All Products</h1>
                        <div className="d-flex flex-wrap">
                            {products.map(p => {
                                return <Link key={p._id} to={`/dashboard/admin/products/${p.slug}`} className='product-list'>
                                    <div className="card m-2" style={{ width: '18rem' }}>
                                    <img src={`http://localhost:80/api/product/Product-Photo/${p._id}`} className="card-img-top" alt="Nothing to display" style={{height:"20rem"}}/>
                                    <hr />
                                        <div className="card-body">
                                            <h5 className="card-title">{p.name}</h5>
                                            <p className="card-text">{p.description.substring(0,10)}...</p>
                                        </div>
                                    </div>
                                </Link>
                            })}
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    )
}

export default ProductList