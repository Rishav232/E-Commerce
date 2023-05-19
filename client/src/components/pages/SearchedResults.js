import React, { useContext } from 'react'
import noteContext from '../../Context/NoteContext'
import Layout from '../Layout/Layout';
import { Link } from 'react-router-dom';

const SearchedResults = () => {
    const Context = useContext(noteContext);
    const { value} = Context;
    return (
        <Layout title={"Searched Results"}>
            <h1 className='text-center'>Searched Results</h1>
            <h6 className="text-center">
                {value?.result < 1 ? "No Results" : `Found ${value.result.length}`}</h6>
            <div className="d-flex flex-wrap">
                {value?.result.map(p => {
                    return <Link key={p._id} to={`/product/${p.slug}`} className='product-list'>
                        <div className="card m-2" style={{ width: '18rem' }}>
                            <img src={`http://localhost:80/api/product/Product-Photo/${p._id}`} className="card-img-top" alt="Nothing to display" />
                            <div className="card-body">
                                <h5 className="card-title">{p.name}</h5>
                                <p className="card-text">{p.description}</p>
                            </div>
                        </div>
                    </Link>
                })}
            </div>
        </Layout>
    )
}

export default SearchedResults