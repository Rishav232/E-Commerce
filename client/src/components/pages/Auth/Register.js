import React from 'react'
import Layout from '../../Layout/Layout'
import { useState } from 'react'
import { toast } from 'react-toastify'
import axios from "axios";
import { useNavigate } from 'react-router-dom';
import "../../../styles/AuthStyles.css"
const Register = () => {
    const navigate = useNavigate();
    const [text, setText] = useState({ name: "", email: "", phone: "", address: "", password: "", answer:"" });
    const handleOnchange = (e) => {
        setText({ ...text, [e.target.id]: e.target.value })
    }
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const { name, email, password, phone, address ,answer } = text;
            // console.log(name,email,password,phone,address,answer);
            const res = await axios.post(`${process.env.REACT_APP_API}/api/auth/register`, { name, email, password, phone, address ,answer });
            if (res.data.success) {
                toast.success(res.data.message);
                setTimeout(() => {
                    navigate("/login");
                }, 1500);

            }
            else
                toast.error(res.data.errors);
            
        }
        catch (e) {
            const errArray = e.response.data.errors;
            for (let i = 0; i < errArray.length; i++) {
                toast.error(errArray[i].msg);
            }
        }
    }
    return (
        <Layout title="Register">
            <div className='register'>

                <form onSubmit={handleSubmit}>
                    <h1>REGISTER</h1>
                    <div className="mb-3 name">
                        <input type="text " className="form-control" id="name" value={text.name} placeholder='Name' onChange={handleOnchange} required />
                    </div>
                    <div className="mb-3 email">
                        <input type="email" className="form-control" id="email" value={text.email} placeholder='Email' onChange={handleOnchange} required />
                    </div>
                    <div className="mb-3 phone">
                        <input type="number" className="form-control" id="phone" value={text.phone} placeholder='Phone Number' onChange={handleOnchange} required />
                    </div>
                    <div className="mb-3 address">
                        <input type="text" className="form-control" id="address" value={text.address} placeholder='Address' onChange={handleOnchange} required />
                    </div>
                    <div className="mb-3 password">
                        <input type="password" className="form-control" id="password" value={text.password} placeholder='Password' onChange={handleOnchange} required />
                    </div>
                    <div className="mb-3 answer">
                        <input type="password" className="form-control" id="answer" value={text.answer} placeholder='Enter Secret Answer' onChange={handleOnchange} required />
                    </div>
                    <button type="submit" className="btn btn-primary">Submit</button>
                </form>

            </div>
        </Layout>
    )
}

export default Register