import React, { useContext } from 'react'
import { NavLink, Link } from 'react-router-dom'
import noteContext from '../../Context/NoteContext'
import { toast } from 'react-hot-toast';
import SearchForm from '../Forms/SearchForm';
import useCategory from '../pages/hooks/useCategory';
import { Badge } from 'antd';
const Header = () => {
  const category = useCategory();
  const Context = useContext(noteContext);
  const { auth, setAuth, cart } = Context;
  const handleOnClick = () => {
    setAuth({
      ...auth, user: null, token: ""
    })

    localStorage.removeItem("auth");
    toast.success("Logged Out Succesfully");


  }
  return (
    <>

      <nav className="navbar navbar-expand-lg bg-body-tertiary sticky-top">
        <div className="container-fluid">
          <Link className="navbar-brand " to="/">🛒 E-COMMERCE</Link >
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
          </button>

          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
              <li className="nav-item me-4">
                <SearchForm />
              </li>
              <li className="nav-item">
                <NavLink className="nav-link " to="/">Home</NavLink >
              </li>
              <li className="nav-item dropdown">
                <Link className="nav-link dropdown-toggle" to="/category" data-bs-toggle="dropdown" >
                  Categories
                </Link>
                <ul className="dropdown-menu">
                  <Link className="dropdown-item" to={`/category`}>All Category</Link>
                  {category?.map(c => {
                    return <li key={c._id}><Link className="dropdown-item" to={`/category/${c.slug}`}>{c.name}</Link></li>
                  }
                  )}
                </ul>
              </li>

              {/* <li className="nav-item">
                <NavLink className="nav-link " to="/category">Category</NavLink>
              </li> */}
              {
                !auth.user ? (<>
                  <li className="nav-item">
                    <NavLink className="nav-link" to="/register">Register</NavLink>
                  </li>
                  <li className="nav-item">
                    <NavLink className="nav-link" to="/login">Login</NavLink>
                  </li></>) :
                  (<li className="nav-item dropdown">
                    <Link className="nav-link dropdown-toggle" to="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                      {auth?.user?.name}
                    </Link>
                    <ul className="dropdown-menu">
                      <li className="nav-item">
                        <NavLink className="nav-link" to={`/dashboard${auth?.user?.role === 1 ? "/admin" : ""}`}>DASHBOARD</NavLink>
                      </li>
                      <li className="nav-item">
                        <NavLink onClick={handleOnClick} className="nav-link" to="/login">LOGOUT</NavLink>
                      </li>
                    </ul>
                  </li>)
              }
              <li className="nav-item">
                <Badge count={cart?.length} showZero>
                  <NavLink className="nav-link" to="/cart">Cart</NavLink>
                </Badge>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </>
  )
}

export default Header