import React from 'react'
import { NavLink} from 'react-router-dom'

const AdminMenu = () => {
    
    return (
        <>
            <div className="text-center dashboard-menu">
                <div className="list-group">
                    <h4>Admin Panel</h4>
                    <div className="list-group">
                        <NavLink to="/dashboard/admin/create-products" className="list-group-item list-group-item-action">Create Products</NavLink>
                        <NavLink to="/dashboard/admin/create-category" className="list-group-item list-group-item-action">Create Category</NavLink>
                        <NavLink to="/dashboard/admin/products" className="list-group-item list-group-item-action">Products</NavLink>
                        <NavLink to="/dashboard/admin/users" className="list-group-item list-group-item-action">User</NavLink>
                        <NavLink to="/dashboard/admin/orders" className="list-group-item list-group-item-action">Orders</NavLink>
                    </div>

                </div>
            </div>
        </>
    )
}

export default AdminMenu