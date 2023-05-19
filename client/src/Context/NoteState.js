import NoteContext from "./NoteContext";
import { useState ,useEffect} from "react";

const NoteState = (props) => {
  const [auth, setAuth] = useState({
    user:null,
    token:""
  })
  const [value,setValue]=useState({
    keyword:"",
    result:[]
  })
  const [cart,setCart]=useState([]);
  useEffect(() => {
    const data=localStorage.getItem("auth");
    if(data)
    {
      const parsedData=JSON.parse(data);
      setAuth({
        ...auth,
        user:parsedData.user,
        token:parsedData.authToken
      })
    }
    // eslint-disable-next-line
  }, [])
  useEffect(() => {
    let x=localStorage.getItem("cart");
    if(x)
    {
      setCart(JSON.parse(x));
    }
  }, [])
  
return (
  <NoteContext.Provider value={{auth,setAuth,value,setValue,cart,setCart}}>
    {props.children}
  </NoteContext.Provider>
)
  // props.children will be all the components inside NotState in app.js
}
export default NoteState;
