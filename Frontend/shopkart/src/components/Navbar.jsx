import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import axiosInstance from '../axioscalls/axios'
import { useSelector } from 'react-redux'
function Navbar() {
  const navigate = useNavigate()
  const { logout } = useAuth()
  const cartItems = useSelector((state) => state.cart.cartItems)
  const totalItems = cartItems.reduce((total, item) => total + item.quantity, 0)
  const [wishlistCount, setWishlistCount] = useState(null)

  useEffect(() => {
    const fetchCount = async () => {
      try {
        const response = await axiosInstance.get('/wishlist')
        setWishlistCount(response.data.count)
      } catch (error) {
        console.error('Unable to load wishlist count:', error)
      }
    }
    const updateCount = (event) => setWishlistCount(event.detail.count)

    fetchCount()
    window.addEventListener('wishlist-updated', updateCount)
    return () => window.removeEventListener('wishlist-updated', updateCount)
  }, [])

  const handleLogout = async() => {
    await logout()
    navigate('/Login')
  }

  return (
    <nav className="navbar" role="navigation" aria-label="Main navigation">
      <div className="navbar-container">
        <Link to="/Home" className="navbar-brand" aria-label="Verbatim Home">
          Verbatim
        </Link>

        <div className="navbar-nav">
          <Link to="/Home" className="navbar-link">Home</Link>
          <Link to="/Products" className="navbar-link">Products</Link>
          <Link to="/About" className="navbar-link">About</Link>
          <Link to="/wishlist" className="navbar-link">
            Wishlist{wishlistCount !== null ? ` (${wishlistCount})` : ''}
          </Link>
          <Link to="/orders" className="navbar-link">My Orders</Link>
          <Link to="/cart" className="navbar-link">Cart ({totalItems})</Link>
        </div>

        <div className="navbar-actions">
          <button
            onClick={handleLogout}
            className="btn btn-secondary"
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  )
}

export default Navbar