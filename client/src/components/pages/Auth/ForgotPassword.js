import axios from 'axios';
import React ,{useState} from 'react'
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast'
import "../../../styles/AuthResetPage.css"
import Layout from '../../Layout/Layout';
const ForgotPassword = () => {
    const navigate=useNavigate();
    const [text, setText] = useState({ email: "", answer:"",newpassword:""});
    const handleOnchange = (e) => {
        setText({ ...text, [e.target.id]: e.target.value })
    }
    const handleSubmit=async (e)=>{
        e.preventDefault();
        try{
        const {email,answer,newpassword}=text;
        const res=await axios.put(`${process.env.REACT_APP_API}/api/auth/forgot-password`,{email,answer,newpassword});
        if(res.data.success)
        {
        toast.success("Password Reset Successful")
        navigate("/login");
        }
        else{
            toast.error("Encountered some Error")
        }
    }
    catch(e)
    {
        toast.error("Encountered some Error");
        console.log(e);
    }
    }
  return (
    <Layout>
    <div className='forgotpass'>
        <form onSubmit={handleSubmit}>
          <h1>RESET PASSWORD</h1>
          <div className="mb-3 email">
            <input type="email" className="form-control" id="email" value={text.email} placeholder='Email' onChange={handleOnchange} required />
          </div>
          <div className="mb-3 answer">
            <input type="password" className="form-control" id="answer" value={text.answer} placeholder='Answer' onChange={handleOnchange} required />
          </div>
          <div className="mb-3 newpass">
            <input type="password" className="form-control" id="newpassword" value={text.newpassword} placeholder='NewPassword' onChange={handleOnchange} required />
          </div>
          <div className="">
          <button type="submit" className="btn btn-primary">RESET PASSWORD</button>
          </div>
          <button type="button" onClick={()=>navigate("/login")} className="btn btn-primary">Cancel</button>
        </form>
      </div>
      </Layout>
  )
}

export default ForgotPassword