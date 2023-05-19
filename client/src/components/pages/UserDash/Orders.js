import React, { useContext, useEffect, useState } from 'react'
import Layout from '../../Layout/Layout'
import UserMenu from './UserMenu'
import noteContext from '../../../Context/NoteContext';
import axios from 'axios';
import moment from "moment"


const Orders = () => {
    const [order, setOrder] = useState([]);
    const Context = useContext(noteContext);
    const { auth } = Context;

    const getOrders = async () => {
        try {
            const { data } = await axios.get("http://localhost:80/api/product/getOrders", {
                headers: {
                    "auth-token": auth?.token
                }
            })
            setOrder(data);
        } catch (error) {
            console.log(error);
        }
    }
    useEffect(() => {
        if (auth?.token)
            getOrders();
    }, [auth?.token])
    return (
        <Layout title="Your Orders">
            <div className="container-fluid m-3 p-3">
                <div className="row">
                    <div className="col-md-3">
                        <UserMenu />
                    </div>
                    <div className="col-md-9">
                        <h1 className='text-center'>Orders</h1>

                        {order?.map((data, i) => {
                            return <div key={data._id} className="border shadow">
                                <table className="table">
                                    <thead>
                                        <tr>
                                            <th scope="col">#</th>
                                            <th scope="col">Buyer_Name</th>
                                            <th scope="col">Order_Date</th>
                                            <th scope="col">Payment_Status</th>
                                            <th scope="col">Quantity</th>
                                            <th scope="col">Order_Status</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr key={data._id}>
                                            <td>{i + 1}</td>
                                            <td>
                                                {data.buyer.name}
                                            </td>
                                            <td>
                                                {moment(data?.createdAt).fromNow()}
                                            </td>
                                            <td>
                                                {data?.payment?.success ? "Success" : "Failed"}
                                            </td>
                                            <td>
                                                {data?.products?.length}
                                            </td>
                                            <td>
                                                {data.status}
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                                <div className="container " >
                                    {data?.products?.map(p => {
                                        return <div key={p._id} className="row card mb-3 p-3 flex-row">
                                            <div className="col-md-4">
                                                <img src={`http://localhost:80/api/product/Product-Photo/${p._id}`}
                                                    height={"150px"}
                                                    width={"150px"}
                                                    className="card-img-top" alt={p.name} />
                                            </div>
                                            <div className="col-md-8">
                                                <p>{p.name}</p>
                                                <p>{p.description}</p>
                                                <p>Cost: Rs {p.price}</p>
                                            </div>
                                        </div>
                                    })}
                                </div>
                            </div>
                        })}
                    </div>
                </div>
            </div>
        </Layout>
    )
}

export default Orders