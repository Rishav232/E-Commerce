import React ,{useContext} from 'react'
import noteContext from '../../Context/NoteContext'
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const SearchForm = () => {
    const Context=useContext(noteContext);
    const {value,setValue}=Context;
    const navigate=useNavigate();
    const handleSubmit=async(e)=>{
        e.preventDefault();
        // console.log(value.keyword);
        try {
            const {data}=await axios.get(`http://localhost:80/api/product/search/${value.keyword}`);
            // console.log(data);
            setValue({...value,result:data})
            navigate("/searchedResults");
        } catch (error) {
            console.log(error);
        }
    }
    return (
        <form className="d-flex me-2" role="search" onSubmit={handleSubmit}>
            <input className="form-control me-2" type="search" placeholder="Search" aria-label="Search" 
            value={value.keyword}
            onChange={(e)=>{setValue({...value,keyword:e.target.value})}}/>
            <button className="btn btn-outline-success search-btn" type="submit" >Search</button>
        </form>

    )
}

export default SearchForm