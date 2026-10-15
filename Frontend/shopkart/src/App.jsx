import React from 'react'
import { Route, Routes, BrowserRouter, Navigate } from 'react-router-dom'
import Register from './Pages/Register'
import Login from './Pages/Login'
import Home from './Pages/Home'
import Products from './Pages/Products'
import ProductDetails from './Pages/ProductDetails'
import PublicRoutes from './components/PublicRoutes'
import ProtectedRoutes from './components/ProtectedRoutes'
import { AuthProvider } from './context/AuthContext.jsx'
import About from './Pages/About.jsx'
import Wishlist from './Pages/Wishlist.jsx'
import Cart from './Pages/Cart.jsx'
import Checkout from './Pages/Checkout.jsx'
import Orders from './Pages/Orders.jsx'
import OrderDetails from './Pages/OrderDetails.jsx'
import { Provider } from 'react-redux'
import store from './store/store'
import CartInitializer from './store/CartInitializer.jsx'

function App() {
  return (
    <AuthProvider>
    <Provider store={store}>
    <BrowserRouter>
      <CartInitializer />
      <Routes>
        <Route path="/Login" element={<PublicRoutes> <Login /></PublicRoutes>} />
        <Route path="/Register" element={<PublicRoutes> <Register /></PublicRoutes>} />
        <Route path="/Home" element={<ProtectedRoutes> <Home /></ProtectedRoutes>} />
        <Route path="/Products" element={<ProtectedRoutes> <Products /></ProtectedRoutes>} />
        <Route path="/Products/:id" element={<ProtectedRoutes> <ProductDetails /></ProtectedRoutes>} />
        <Route path="/About" element={<ProtectedRoutes> <About /></ProtectedRoutes>} />
        <Route path="/wishlist" element={<ProtectedRoutes><Wishlist/></ProtectedRoutes>}/>
        <Route path="/cart" element={<ProtectedRoutes><Cart /></ProtectedRoutes>} />
        <Route path="/checkout" element={<ProtectedRoutes><Checkout /></ProtectedRoutes>} />
        <Route path="/orders" element={<ProtectedRoutes><Orders /></ProtectedRoutes>} />
        <Route path="/order-success/:id" element={<ProtectedRoutes><OrderDetails /></ProtectedRoutes>} />
        <Route path="/" element={<Navigate to="/Login" replace />} />
      </Routes>
    </BrowserRouter>
    </Provider>
    </AuthProvider>
  )
}

export default App