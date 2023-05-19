import React, { useState, useEffect,useContext } from 'react'
import Layout from '../../Layout/Layout'
import AdminMenu from './AdminMenu'
import { Select } from "antd";
import { toast } from 'react-hot-toast';
import axios from 'axios';
import noteContext from '../../../Context/NoteContext';
import { useNavigate } from 'react-router-dom';

const { Option } = Select;
const CreateProduct = () => {
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
  const navigate=useNavigate();
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
  useEffect(() => {
    getCategory();
    // eslint-disable-next-line
  }, [])
  const handleSubmit=async(e)=>{
    try {
      e.preventDefault();
      // console.log(name,description,quantity,price,shipping,photo,category);
      const productData=new FormData();
      productData.append("name",name);
      productData.append("description",description);
      productData.append("quantity",quantity);
      productData.append("price",price);
      productData.append("shipping",shipping);
      productData.append("photo",photo);
      productData.append("category",category);
      // console.log(productData);
      const {data}=await axios.post("http://localhost:80/api/product/createProducts",
      productData,
      {
        headers:{
          "auth-token":auth?.token
        }
      })
      if(data.success)
      {
        toast.success(`${data.message}: ${data.product.name} `)
        navigate("/dashboard/admin/products")

      }
    } catch (error) {
      console.log(error);
    }
  }
  return (
    <Layout title="Create Products">
      <div className="container-fluid m-3 p-3">
        <div className="row">
          <div className="col-md-3">
            <AdminMenu />
          </div>
          <div className="col-md-9">
            <h1>Create Product</h1>
            <div className="m-1 w-75">
              <Select bordered={false}
                placeholder="Select Category"
                onChange={(value) => { setCategory(value) }}
                showSearch
                size='large'
                className='form-select mb-3'>
                {categories.map(c => {
                  return <Option key={c._id} value={c._id}>
                    {c.name}
                  </Option>
                })}
              </Select>
            </div>
            <div className="mb-3">
              <label className='btn btn-outline-secondary col-md-12'>
                {photo ? photo.name : "Upload image"}
                <input type="file"
                  name="photo"
                  accept='image/*'
                  onChange={(e) => { setPhoto(e.target.files[0]) }}
                  hidden />
              </label>
            </div>
            <div className="mb-3">
              {photo &&
                <div className="text-center">
                  <img src={URL.createObjectURL(photo)} alt="Product_photo"
                    className='img img-responsive'
                    height={"200px"}
                  />
                </div>}
            </div>
            
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
                  className='form-select mb-3'>
                  <Option value="1">
                    Yes
                  </Option>
                  <Option value="0">
                    No
                  </Option>
                </Select>
              </div>
              <div className="">
              <button className='btn btn-primary' onClick={handleSubmit}>Create Product</button>
              </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default CreateProduct