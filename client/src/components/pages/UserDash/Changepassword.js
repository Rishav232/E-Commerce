import React, { useContext, useState } from 'react'
import Layout from '../../Layout/Layout'
import { toast } from 'react-hot-toast';
import axios from 'axios';
import noteContext from '../../../Context/NoteContext';
import { useNavigate } from 'react-router-dom';
import "../../../styles/AuthStyles.css"
const Changepassword = () => {
    const Context=useContext(noteContext);
    const navigate=useNavigate();
    const {auth,setAuth}=Context;
    const [password,setPassword]=useState("");
    const [Confirmpassword,setConfirmPassword]=useState("");
    const [oldpassword,setoldPassword]=useState("");

    const handleSubmit=async(e)=>{
        e.preventDefault();
        try {
            if(Confirmpassword!==password)
            toast.error("Confirm Password is not same as New Password");

            const {data}=await axios.put(`${process.env.REACT_APP_API}/api/auth/password-change`,{password,oldpassword},
            {
                headers:{
                    "auth-token":auth?.token
                }
            })
            if(data.success)
            toast.success("Password Reset Successful.Redirecting you to Login Page")  
            setTimeout(() => {
                setAuth({...auth,user:"",token:""})
                localStorage.removeItem("auth");
                navigate("/login");
            }, 1500);
            
           
        } catch (error) {
            console.log(error);
            toast.error("Something went wrong");
        }
    }
    return (
        <Layout>
            <div className='register'>
                <form onSubmit={handleSubmit}>
                    <h1>CHANGE PASSWORD</h1>
                    <div className="mb-3 password">
                        <input type="password" className="form-control" id="oldpass" value={oldpassword} placeholder='Old Password' onChange={(e)=>{setoldPassword(e.target.value)}} required />
                    </div>
                    <div className="mb-3 password">
                        <input type="password" className="form-control" id="newpass" value={password} placeholder='New Password' onChange={(e)=>{setPassword(e.target.value)}} required />
                    </div>
                    <div className="mb-3 password">
                        <input type="password" className="form-control" id="confirmpass" value={Confirmpassword} placeholder='Confirm Password' onChange={(e)=>{setConfirmPassword(e.target.value)}} required />
                    </div>
                    <div className="d-flex flex-column justify-content-center ms-4">
                    <button type="submit" className="btn btn-primary ">Update Password</button>
                    <button type="button" onClick={()=>navigate("/dashboard/profile/")} className="btn btn-primary mt-2">Cancel</button>
                    </div>
                </form>

            </div>
        </Layout>
    )
}

export default Changepassword