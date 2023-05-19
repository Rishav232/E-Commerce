import React from 'react'
import { NavLink} from 'react-router-dom'
const UserMenu = () => {
  return (
    <>
            <div className="text-center dashboard-menu">
                <div className="list-group">
                    <h4>User Panel</h4>
                    <div className="list-group">
                        <NavLink to="/dashboard/profile" className="list-group-item list-group-item-action">Profile</NavLink>
                        <NavLink to="/dashboard/orders" className="list-group-item list-group-item-action">Orders</NavLink>
                    </div>

                </div>
            </div>
        </>
  )
}

export default UserMenu