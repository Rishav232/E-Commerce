import React, { useContext } from 'react'
import Layout from '../../Layout/Layout'
import noteContext from '../../../Context/NoteContext'
import AdminMenu from './AdminMenu';

const AdminDashboard = () => {
  const Context=useContext(noteContext);
  const {auth}=Context;
  return (
    <Layout title="Admin Dashboard">
    <div className="container-fluid m-3 p-3 dashboard">
      <div className="row">
        <div className="col-md-3">
          <AdminMenu/>
        </div>
        <div className="col-md-9">
           <div className="card mt-3">
            <h2>Admin Name: {auth?.user?.name}</h2>
            <h2>Admin Email: {auth?.user?.email}</h2>
            <h2>Admin Phone-Number: {auth?.user?.phone}</h2>
           </div>
        </div>
      </div>
    </div>
    </Layout>
  )
}

export default AdminDashboard