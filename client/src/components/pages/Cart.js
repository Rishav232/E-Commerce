import React, { useContext, useState, useEffect } from 'react'
import Layout from '../Layout/Layout'
import noteContext from '../../Context/NoteContext'
import { useNavigate } from 'react-router-dom'
import DropIn from "braintree-web-drop-in-react";
import axios from 'axios';
import { toast } from 'react-hot-toast';
import "../../styles/CartPage.css"
const Cart = () => {
  const navigate = useNavigate();
  const Context = useContext(noteContext);
  const { cart, auth, setCart } = Context;
  const [clientToken, setClientToken] = useState("")
  const [instance, setInstance] = useState("")
  const [loading, setLoading] = useState(false);
  const handleDelete = (pid) => {
    let myCart = [...cart];
    let index = myCart.findIndex(item => item._id === pid);
    myCart.splice(index, 1);
    localStorage.setItem("cart", JSON.stringify(myCart));
    setCart(myCart);
  }

  const totalCount = () => {
    let total = 0;
    cart?.map(p => total += p.price);

    return total.toLocaleString('en-IN', {
      style: "currency",
      currency: "INR"
    });
  }
  //get client TOken

  const getClientToken = async () => {
    try {
      const { data } = await axios.get("http://localhost:80/api/product/braintree/token");
      setClientToken(data?.clientToken);
    } catch (error) {
      console.log(error);
    }
  }
  useEffect(() => {
    getClientToken();
  }, [auth?.token])

  //make payment

  const handlePayment = async () => {
    try {
      setLoading(true)
      const { nonce } = await instance.requestPaymentMethod();
      const { data } = await axios.post(`http://localhost:80/api/product/braintree/transaction`, { cart, nonce },
      {
        headers:{
          "auth-token":auth?.token
        }
      })
      if(data?.ok)
      {
      setLoading(false);
      localStorage.removeItem("cart");
      setCart([]);
      navigate("/dashboard/orders");
      toast.success("Payment Completed Succesfully");
      }
    } catch (error) {
      console.log(error)
      setLoading(false);
    }
  }

  return (
    <Layout title="Your Cart">
      <div className='container cart-page'>
        <div className="row">
          <div className="col-md-12">
            <h1 className='text-center mt-2 p-1'>
              Hello {auth?.user?auth?.user?.name:"Guest"}
              <h4 className='text-center'>
              {cart?.length ?
                `You have ${cart.length} items in your cart 
                ${auth?.token ? "" : "Please Login to Checkout"}`
                : "Your Cart is Empty"}
            </h4>
            </h1>  
          </div>
        </div>
        <div className="row">
          <div className="col-md-9">
            {cart?.map(p => {
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
                  <button className='btn btn-danger card-btn' onClick={() => handleDelete(p._id)}>Remove</button>
                </div>
              </div>
            })}
          </div>
          <div className="col-md-3 text-center cart-summary">
            <h2>Cart Summary</h2>
            Total | Checkout | Payment
            <hr />
            <h4>Total:{totalCount()}</h4>
            <hr />
            {
              auth?.user?.address ? (
                <div className="mb-3">
                  <h4>Current Address</h4>
                  <h6>{auth?.user?.address}</h6>
                  <button className='btn btn-outline-warning mb-2' onClick={() => navigate("/dashboard/profile")}>
                    Update Address
                  </button>
                </div>
              ) : (
                <div className="mb-3">
                  {auth?.token ? (
                    <button className='btn btn-outline-warning' onClick={() => navigate("/dashboard/profile")}>
                      Update Address
                    </button>
                  ) : (
                    <button className='btn btn-outline-warning' onClick={() => navigate("/login", {
                      state: "/cart"
                    })}>
                      Please Log in to Checkout
                    </button>
                  )}
                </div>
              )
            }
            {!clientToken || !cart?.length ? "" :
              (
                <div className="mt-2 mb-3">
                  <DropIn
                    options={{
                      authorization: clientToken
                    }}
                    onInstance={(instance) => { setInstance(instance) }}
                  />
                  <button className='btn btn-primary'
                    onClick={handlePayment}
                    disabled={loading || !instance || !auth?.user?.address}
                  >{
                      loading ? "Processing...." : "Make Payment"}
                  </button>
                </div>
              )}
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default Cart