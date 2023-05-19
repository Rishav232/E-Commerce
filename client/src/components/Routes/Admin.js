import { useEffect, useState, useContext } from "react";
import noteContext from "../../Context/NoteContext";
import axios from "axios";
import { Outlet } from "react-router-dom";
import Spinner from "../pages/Spinner";
export default function AdminRoutes (){
    const Context = useContext(noteContext);
    const { auth } = Context;
    const [ok, setOk] = useState(false);

    const authFunc = async () => {
        const res = await axios.get(`${process.env.REACT_APP_API}/api/auth/isAdmin`, {
            headers: {
                "auth-token": auth?.token
            }
        })
        if (res.data.ok)
            setOk(true);
        else
            setOk(false);
    }
   useEffect(() => {
     if(auth?.token)
     authFunc();
     // eslint-disable-next-line
   }, [auth?.token])
   
    return ok ? <Outlet /> : <Spinner path=""/>;
}