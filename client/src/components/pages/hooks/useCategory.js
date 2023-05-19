import axios from "axios";
import { useState,useEffect } from "react";

export default function useCategory(){
    const [category, setcategory] = useState([])
    const getCategory=async()=>{
        try {
            const {data}=await axios.get("http://localhost:80/api/category/getAllcategory")
            setcategory(data.allCategory);

        } catch (error) {
            console.log(error);
        }
    }
    useEffect(()=>{
      getCategory();
    },[])
      return category;
    
}