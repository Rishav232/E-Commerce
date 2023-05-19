import React ,{useContext} from 'react'
import Layout from '../../Layout/Layout'
import noteContext from '../../../Context/NoteContext'
import UserMenu from './UserMenu';
const Dashboard = () => {
  const Context=useContext(noteContext);
  const {auth}=Context;
  return (
    <Layout>
    <div className="container-flui m-3 p-3 dashboard">
      <div className="row">
        <div className="col-md-3">
          <UserMenu/>
        </div>
        <div className="col-md-9">
           <div className="card mt-3 w-75 p-3">
            <h2>User Name: {auth?.user?.name}</h2>
            <h2>User Email: {auth?.user?.email}</h2>
            <h2>User Phone Number: {auth?.user?.phone}</h2>
           </div>
        </div>
      </div>
    </div>
    </Layout>
  )
}

export default Dashboard