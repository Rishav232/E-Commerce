import React from 'react'
import Layout from '../../Layout/Layout'
import useCategory from '../hooks/useCategory'
import { Link } from 'react-router-dom';

const Categories = () => {


    const category = useCategory();
    return (
        <Layout title="All Categories">
            <div className="container" style={{ marginTop: "100px" }}>
                <div className="row container">
                    {category?.map(c => {
                        return <div key={c._id} className="col-md-4 mt-5 mb-3 gx-3 gy-3" >
                            <div className="card">
                                <Link to={`/category/${c.slug}`} className='btn  btn-cat'>
                                    {c.name}
                                </Link>
                            </div>
                        </div>
                    })}
                </div>
            </div>
        </Layout>
    )
}

export default Categories