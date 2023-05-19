import React ,{useContext} from 'react'
import Layout from '../../Layout/Layout'
import { useState } from 'react'
import { toast } from 'react-hot-toast'
import axios from "axios";
import { useLocation, useNavigate } from 'react-router-dom';
import "../../../styles/AuthLogin.css"
import noteContext from '../../../Context/NoteContext'
const Login = () => {
  const Context=useContext(noteContext);
  const {auth , setAuth}=Context;
  const navigate = useNavigate();
  const location=useLocation();
  const [text, setText] = useState({ email: "", password: "" });
  const handleOnchange = (e) => {
    setText({ ...text, [e.target.id]: e.target.value })
  }
  const handleSubmit = async(e) => {
    e.preventDefault();
    try {
      const {email, password} = text;
      // console.log(name,email,password,phone,address);
      const res = await axios.post(`${process.env.REACT_APP_API}/api/auth/login`, {  email, password});
      if (res.data.success) {
        toast.success(res.data.message);
        setAuth({
          ...auth,
          user:res.data.user,
          token:res.data.authToken
        })
        localStorage.setItem("auth",JSON.stringify(res.data));
        // console.log(res.data);
        navigate(location.state||"/");
      }
      else
        toast.error(res.data.errors);
    }
    catch (e) {
      console.log(e);
      toast.error(e.response.data.errors);
    }
  }
  return (
    <Layout title="Login">
      <div className='login'>
        <form onSubmit={handleSubmit}>
          <h1>LOGIN</h1>
          <div className="mb-3 email">
            <input type="email" className="form-control" id="email" value={text.email} placeholder='Email' onChange={handleOnchange} required />
          </div>
          <div className="mb-3 password">
            <input type="password" className="form-control" id="password" value={text.password} placeholder='Password' onChange={handleOnchange} required />
          </div>
          <div className="">
          <button type="submit" className="btn btn-primary">Submit</button>
          </div>
          <button type="button" onClick={()=>navigate("/forgotpassword")} className="btn btn-primary">Forgot Password?</button>
          
        </form>
        
      </div>
    </Layout>
  )
}

export default Login