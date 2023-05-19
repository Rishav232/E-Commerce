import React, { useContext, useEffect, useState } from 'react'
import Layout from '../../Layout/Layout'
import AdminMenu from './AdminMenu'
import axios from 'axios';
import noteContext from '../../../Context/NoteContext';
import "../../../styles/Homepage.css"
import { toast } from 'react-hot-toast';
const User = () => {
  const [users,setUsers]=useState([]);
  const Context=useContext(noteContext);
  const {auth}=Context;
  const getUsers=async()=>{
    try {
      const {data}=await axios.get("http://localhost:80/api/auth/allUsers",{headers:{
        "auth-token":auth?.token
      }})
      // console.log(data);
      setUsers(data);
    } catch (error) {
      console.log(error);
    }
  }
  useEffect(()=>{
     if(auth?.token)
     getUsers();
     // eslint-disable-next-line
  },[auth?.token])

  const handleDelete=async(id)=>{

    try {
      const {data}=await axios.delete(`http://localhost:80/api/auth/deleteUser/${id}`,
      {
        headers:{
          "auth-token":auth?.token
        }
      })
      if(data.success)
      {
      toast.success("User Deleted Successfully");
      getUsers();
      }
    } catch (error) {
      console.log(error);
    }
  }
  return (    
    <Layout title="User">
    <div className="container-fluid m-3 p-3">
      <div className="row">
        <div className="col-md-3">
          <AdminMenu/>
        </div>
        <div className="col-md-9">
           <h1>All Users</h1>
           {users?.length ? (users?.map(p => {
                return <div key={p._id} className="card m-2" style={{ width: '18rem' }}>
                  <div className="card-body">
                    <div className="card-name-price">
                      <h5 className="card-title">{p?.name}</h5>
                      <h5 className="card-price">{p?.email}</h5>
                    </div>
                    <p className="card-text">{p?.address}</p>
                  </div>
                  <div>
                      <button className="btn btn-danger details mb-2 ms-2" onClick={()=>handleDelete(p._id)}>Delete</button>
                  </div>
                </div>
              })) : (
                <h1 className='text-center'>Nothing to Display</h1>
              )}

        </div>
      </div>
    </div>
    </Layout>
  )
}

export default User