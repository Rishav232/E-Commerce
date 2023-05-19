import React, { useState, useEffect, useContext } from 'react'
import Layout from '../../Layout/Layout'
import AdminMenu from './AdminMenu'
import { toast } from 'react-hot-toast';
import axios from 'axios';
import CategoryForm from '../../Forms/CategoryForm';
import noteContext from '../../../Context/NoteContext';
import { Modal } from "antd";
const CreateCategory = () => {
  const [categories, setCategories] = useState([]);
  const [name, setName] = useState("");
  const [visible, setVisible] = useState(false);
  const [selected, setSelected] = useState(null);
  const [updatedName, setUpdatedName] = useState("");
  const Context = useContext(noteContext);
  const { auth } = Context;
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
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post("http://localhost:80/api/category/create-category", { name },
        {
          headers:
          {
            "auth-token": auth?.token
          }
        });
      if (data.success) {
        toast.success(`${name} created successfully`);
        setName("");
        getCategory();
      }
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong");
    }

  }
  useEffect(() => {
    getCategory();
    // eslint-disable-next-line
  }, [])
  const handleEdit = async (e) => {
    try {
      e.preventDefault();
      const { data } = await axios.put(`http://localhost:80/api/category/update-category/${selected._id}`, { name: updatedName },
        {
          headers: {
            "auth-token": auth?.token
          }
        })
        toast.success(data.message);
        setUpdatedName("");
        setSelected(null);
        setVisible(false);
        getCategory();
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong");
    }
  }
  const handleDelete=async(e,element)=>{
    e.preventDefault();
    const {data}=await axios.delete(`http://localhost:80/api/category/deleteCategory/${element._id}`,
    {
      headers:{
        "auth-token":auth?.token
      }
    })
    toast.success(`${element.name} ${data.message} deleted successfully`);
    getCategory();
  }
  return (
    <Layout title="Create Category">
      <div className="container-fluid m-3 p-3">
        <div className="row">
          <div className="col-md-3">
            <AdminMenu />
          </div>
          <div className="col-md-9">
            <h1>Manage Category</h1>
            <div className="mt-3">
              <CategoryForm name={name} setName={setName} handleSubmit={handleSubmit} />
            </div>
            <table className="table">
              <thead>
                <tr>
                  <th scope="col">Name</th>
                  <th scope="col">Action</th>
                </tr>
              </thead>
              <tbody>
                {categories?.map((data) => {
                  return <>
                    <tr>
                      <td key={data._id}>{data.name}</td>
                      <td>
                        <button className='btn btn-primary ms-2' onClick={() => { setVisible(true); setUpdatedName(data.name); setSelected(data) }}>Edit</button>
                        <button className='btn btn-danger ms-2' onClick={(e)=>{handleDelete(e,data)}}>Delete</button>
                      </td>
                    </tr>
                  </>
                })}
              </tbody>
            </table>
            <Modal onCancel={() => setVisible(false)} footer={null} open={visible}>
              <CategoryForm name={updatedName} setName={setUpdatedName} handleSubmit={handleEdit} />
            </Modal>
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default CreateCategory