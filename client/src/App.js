import { BrowserRouter, Routes, Route } from "react-router-dom"
import Homepage from "./components/pages/Homepage";
import Contact from "./components/pages/Contact";
import PageNotFound from "./components/pages/PageNotFound";
import About from "./components/pages/About";
import Policy from "./components/pages/Policy";
import Register from "./components/pages/Auth/Register";
import Login from "./components/pages/Auth/Login";
import NoteState from "./Context/NoteState";
import Dashboard from "./components/pages/UserDash/Dashboard";
import PrivateRoutes from "./components/Routes/Private";
import ForgotPassword from "./components/pages/Auth/ForgotPassword";
import AdminRoutes from "./components/Routes/Admin";
import AdminDashboard from "./components/pages/Admin/AdminDashboard";
import CreateCategory from "./components/pages/Admin/CreateCategory";
import CreateProduct from "./components/pages/Admin/CreateProduct";
import User from "./components/pages/Admin/User";
import Profile from "./components/pages/UserDash/Profile";
import Orders from "./components/pages/UserDash/Orders";
import 'antd/dist/reset.css';
import ProductList from "./components/pages/Admin/ProductList";
import UpdateProducts from "./components/pages/Admin/UpdateProducts";
import SearchedResults from "./components/pages/SearchedResults";
import ProductDetails from "./components/pages/ProductDetails";
import Categories from "./components/pages/Category/Categories";
import CategoriesList from "./components/pages/Category/CategoriesList";
import Cart from "./components/pages/Cart";
import Changepassword from "./components/pages/UserDash/Changepassword";
import AdminOrder from "./components/pages/Admin/AdminOrder";
function App() {
  return (
    <>
      <NoteState>
        <BrowserRouter>
          <Routes>
            <Route exact path="/" element={<Homepage />} />
            <Route exact path="/cart" element={<Cart />} />
            <Route exact path="/category" element={<Categories />} />
            <Route exact path="/category/:slug" element={<CategoriesList />} />
            <Route exact path="/product/:slug" element={<ProductDetails />} />
            <Route exact path="/about" element={<About />} />
            <Route exact path="/searchedResults" element={<SearchedResults />} />


            <Route path="/dashboard" element={<AdminRoutes />}>
              <Route path="admin" element={<AdminDashboard />} />
              <Route path="admin/create-products" element={<CreateProduct />} />
              <Route path="admin/products" element={<ProductList />} />
              <Route path="admin/products/:slug" element={<UpdateProducts />} />
              <Route path="admin/create-category" element={<CreateCategory />} />
              <Route path="admin/users" element={<User />} />
              <Route path="admin/orders" element={<AdminOrder />} />
            </Route>

            <Route path="/dashboard" element={<PrivateRoutes />}>
              <Route path="" element={<Dashboard />} />
              <Route path="profile" element={<Profile />} />
              <Route path="orders" element={<Orders />} />
              <Route path="profile/change-password" element={<Changepassword />} />
            </Route>



            <Route exact path="/contact" element={<Contact />} />
            <Route exact path="/policy" element={<Policy />} />
            <Route exact path="/register" element={<Register />} />

            <Route exact path="/forgotpassword" element={<ForgotPassword />} />


            <Route exact path="/login" element={<Login />} />
            <Route exact path="*" element={<PageNotFound />} />
          </Routes>
        </BrowserRouter>
      </NoteState>
    </>
  );
}

export default App;
