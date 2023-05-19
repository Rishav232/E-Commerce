import React, { useContext, useState } from 'react'
import UserMenu from './UserMenu'
import Layout from '../../Layout/Layout'
import { useNavigate } from 'react-router-dom';
import "../../../styles/AuthStyles.css"
import noteContext from '../../../Context/NoteContext';
import { toast } from 'react-hot-toast';
import axios from 'axios';
const Profile = () => {
  const Context = useContext(noteContext);
  const { auth ,setAuth} = Context;
  const navigate = useNavigate();
  const [text, setText] = useState({ name: auth?.user?.name, email: auth?.user?.email, phone: auth?.user?.phone, address: auth?.user?.address});
  const handleOnchange = (e) => {
    setText({ ...text, [e.target.id]: e.target.value })
  }
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { name, email, phone, address } = text;
      // console.log(name,email,password,phone,address);
      const { data } = await axios.put(`${process.env.REACT_APP_API}/api/auth/update-profile`, { name, email, phone, address }, {
        headers: {
          "auth-token": auth?.token
        }
        
      });
      // console.log(data);
      setAuth({...auth,user:data?.user});
      let ls=localStorage.getItem("auth");
      ls=JSON.parse(ls);
      ls.user=data.user
      localStorage.setItem("auth",JSON.stringify(ls));
      if (data.success) {
        toast.success(data.message);
      }

    }
    catch (e) {
      console.log(e);
      toast.error("Something went wrong");
    }
  }
  return (
    <Layout title="Profile">
      <div className="container-fluid m-3 p-3">
        <div className="row">
          <div className="col-md-3">
            <UserMenu />
          </div>
          <div className="col-md-9">
            <div className='register'>
              <form onSubmit={handleSubmit}>
                <h1>UPDATE PROFILE</h1>
                <div className="mb-3 name">
                  <input type="text " className="form-control" id="name" value={text.name} placeholder='Name' onChange={handleOnchange} required />
                </div>
                <div className="mb-3 email">
                  <input type="email" className="form-control" id="email" value={text.email} placeholder='Email' onChange={handleOnchange} disabled />
                </div>
                <div className="mb-3 phone">
                  <input type="number" className="form-control" id="phone" value={text.phone} placeholder='Phone Number' onChange={handleOnchange} required />
                </div>
                <div className="mb-3 address">
                  <input type="text" className="form-control" id="address" value={text.address} placeholder='Address' onChange={handleOnchange} required />
                </div>
                <div className="d-flex flex-column">
                <button type="submit" className="btn btn-primary">Update Profile</button>
                <button type="button" onClick={()=>navigate("/dashboard/profile/change-password")} className="btn btn-primary mt-2">Change Password</button>
                </div>
              </form>

            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default Profile