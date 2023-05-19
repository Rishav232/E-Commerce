import React, { useState, useEffect, useContext } from 'react'
import Layout from '../../Layout/Layout'
import AdminMenu from './AdminMenu'
import { Select } from "antd";
import { toast } from 'react-hot-toast';
import axios from 'axios';
import noteContext from '../../../Context/NoteContext';
import { useNavigate, useParams } from 'react-router-dom';

const { Option } = Select;

const UpdateProducts = () => {
    const Context = useContext(noteContext);
    const { auth } = Context;
    const [categories, setCategories] = useState([]);
    const [name, setName] = useState("");
    const [description, setdescription] = useState("");
    const [price, setPrice] = useState("");
    const [quantity, setQuantity] = useState("");
    const [category, setCategory] = useState("");
    const [photo, setPhoto] = useState("");
    const [shipping, setShipping] = useState("");
    const [id,setId]=useState("");
    const navigate = useNavigate();
    const params = useParams();
    const getCategory = async () => {
        try {
            const { data } = await axios.get("http://localhost:80/api/category/getAllcategory");
            // console.log(res.data);

            setCategories(data.allCategory);
            // console.log(categories);

        } catch (error) {
            console.log(error);
            toast.error("Something went wrong");
        }
    }
    const getSingleProduct = async () => {
        try {
            const { data } = await axios.get(`http://localhost:80/api/product/getSingleProduct/${params.slug}`)
            setName(data.product[0].name);
            setId(data.product[0]._id)
            setdescription(data.product[0].description);
            setPrice(data.product[0].price);
            setQuantity(data.product[0].quantity);
            setShipping(data.product[0].shipping);
            setCategory(data.product[0].category._id)
        } catch (error) {
            console.log(error);
            toast.error("Something went wrong");
        }
    }
    useEffect(() => {
        getCategory();
        // eslint-disable-next-line
    }, [])
    useEffect(() => {
        getSingleProduct();
        // eslint-disable-next-line
    }, [])
    const handleUpdate = async (e) => {
        try {
            e.preventDefault();
            // console.log(name,description,quantity,price,shipping,photo,category,id);
            const productData = new FormData();
            productData.append("name", name);
            productData.append("description", description);
            productData.append("quantity", quantity);
            productData.append("price", price);
            productData.append("shipping", shipping);
            photo && productData.append("photo", photo);
            productData.append("category", category);
            // console.log(productData);
            const { data } = await axios.put(`http://localhost:80/api/product/update-product/${id}`,
                productData,
                {
                    headers: {
                        "auth-token": auth?.token
                    }
                })
            if (data.success) {
                toast.success(`${data.message}: ${data.product.name} `)
                navigate("/dashboard/admin/products")

            }
        } catch (error) {
            console.log(error);
        }
    }
    const handleDelete=async()=>{
        try {
            let answer=window.prompt("Are you sure you want to delete?");
            if(answer==="No"||answer==="no")
            {
                return;
            }
            if(answer!=="yes"&&answer!=="Yes")
            {
                // console.log(answer);
                window.alert("Incorrect response");
                return;
            }
            const {data}=await axios.delete(`http://localhost:80/api/product/deleteProduct/${id}`,
            {
                headers:{
                    "auth-token":auth?.token
                }
            })
            if(data.success)
            {
                toast.success("Deleted Successfully");
                navigate("/dashboard/admin/products")
            }
        } catch (error) {
            console.log("Error in deleting")
        }
    }
    return (
        <Layout title="Update Products">
            <div className="container-fluid m-3 p-3">
                <div className="row">
                    <div className="col-md-3">
                        <AdminMenu />
                    </div>
                    <div className="col-md-9">
                        <h1>Update Product</h1>
                        <div className="m-1 w-75">
                            <Select bordered={false}
                                placeholder="Select Category"
                                onChange={(value) => { setCategory(value) }}
                                showSearch
                                size='large'
                                className='form-select mb-3'
                                value={category}>
                                {categories.map(c => {
                                    return <Option key={c._id} value={c._id}>
                                        {c.name}
                                    </Option>
                                })}
                            </Select>
                        </div>
                        <div className="mb-3">

                            <label className='btn btn-outline-secondary col-md-12'>
                                {photo ? photo.name : "Update image"}
                                <input type="file"
                                    name="photo"
                                    accept='image/*'
                                    onChange={(e) => { setPhoto(e.target.files[0]) }}
                                    hidden />
                            </label>
                        </div>
                        {photo?(
                            <div className="mb-3">
                                {photo &&
                                    <div className="text-center">
                                        <img src={URL.createObjectURL(photo)} alt="Product_photo"
                                            className='img img-responsive'
                                            height={"200px"}
                                        />
                                    </div>}
                            </div>)
                            :
                            (<div className="mb-3">
                            {
                                <div className="text-center">
                                    <img src={id&&`http://localhost:80/api/product/Product-Photo/${id}`} alt="Product_photo"
                                        className='img img-responsive'
                                        height={"200px"}
                                    />
                                </div>}
                        </div>)
                        }
                        <div className="mb-3">
                            <input type="text"
                                placeholder='Enter Name of the Product'
                                onChange={(e) => { setName(e.target.value) }}
                                value={name}
                                className='form-control' />
                        </div>
                        <div className="mb-3">
                            <textarea
                                placeholder='Enter Description'
                                onChange={(e) => { setdescription(e.target.value) }}
                                className='form-control'
                                value={description} />
                        </div>
                        <div className="mb-3">
                            <input type="number"
                                placeholder='Enter Price of the Product'
                                onChange={(e) => { setPrice(e.target.value) }}
                                value={price}
                                className='form-control' />
                        </div>
                        <div className="mb-3">
                            <input type="number"
                                placeholder='Enter Quantity of the Product'
                                onChange={(e) => { setQuantity(e.target.value) }}
                                value={quantity}
                                className='form-control' />
                        </div>
                        <div className="mb-3 w-75">
                            <Select bordered={false}
                                placeholder="Select Shipping"
                                onChange={(value) => { setShipping(value) }}
                                showSearch
                                size='large'
                                className='form-select mb-3'
                                value={shipping ? "Yes" : "No"}>
                                <Option value="1">
                                    Yes
                                </Option>
                                <Option value="0">
                                    No
                                </Option>
                            </Select>
                        </div>
                        <div className="d-flex">
                            <button className='btn btn-primary ms-2' onClick={handleUpdate}>Update Product</button>
                            <button className='btn btn-danger ms-2' onClick={handleDelete}>Delete Product</button>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    )
}

export default UpdateProducts