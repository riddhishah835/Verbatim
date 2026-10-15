import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axiosInstance from '../axioscalls/axios'
import { useDispatch, useSelector } from 'react-redux'
import { addToCart } from '../store/cartSlice'

function ProductCard({ product, isWishlisted = false, wishlistReady = true, onWishlistChange }) {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const cartItems = useSelector((state) => state.cart.cartItems)
  const pendingProductIds = useSelector((state) => state.cart.pendingProductIds)
  const cartItem = cartItems.find((item) => item.product._id === product._id)
  const availableStock = product.stock - (cartItem?.quantity || 0)
  const inStock = availableStock > 0
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [cartError, setCartError] = useState('')
  const addingToCart = pendingProductIds.includes(product._id)
  const handleAddToCart = async () => {
    setCartError('')
    try {
      await dispatch(addToCart(product._id))
      navigate('/cart')
    } catch (requestError) {
      setCartError(requestError.response?.data?.message || 'Unable to add product to cart.')
    }
  }

  const handleWishlistToggle = async () => {
    if (saving) return
    setSaving(true)
    setError('')
    try {
      const response = await axiosInstance.patch(`/wishlist/${product._id}/toggle`)
      onWishlistChange?.(product._id, response.data.saved)
      window.dispatchEvent(new CustomEvent('wishlist-updated', {
        detail: { count: response.data.count },
      }))
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'Unable to save product. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <article className="product-card">
      <div className="product-image">
        {product.image ? (
          <img src={product.image} alt={product.name} loading="lazy" />
        ) : (
          <div className="product-placeholder" aria-hidden="true">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
              <circle cx="8.5" cy="8.5" r="1.5" />
              <path d="M21 15l-5-5L5 17" />
            </svg>
          </div>
        )}
        {product.discount && (
          <span className="product-badge">-{product.discount}%</span>
        )}
      </div>
      <div className="product-info">
        {product.category && (
          <span className="product-category">{product.category}</span>
        )}
        <h3 className="product-name">{product.name}</h3>
        <div className="product-price-row">
          <span className="product-price">₹{product.price}</span>
        </div>
        <div className="product-stock">
          {inStock ? (
            <span className="in-stock">{availableStock} units left</span>
          ) : (
            <span className="out-of-stock">Out of Stock</span>
          )}
        </div>
        <div className="product-actions">
          <button
            type="button"
            className="btn btn-primary btn-sm"
            onClick={handleAddToCart}
            disabled={!inStock || addingToCart}
          >
            {addingToCart ? 'Adding...' : 'Add to Cart'}
          </button>
          <Link to={`/Products/${product._id}`} className="btn btn-secondary btn-sm view-details-btn">
            View Details
          </Link>
          <button
            type="button"
            className="btn btn-secondary btn-sm wishlist-btn-stub"
            onClick={handleWishlistToggle}
            disabled={saving || !wishlistReady}
          >
            {saving ? '⏳ Saving...' : !wishlistReady ? 'Loading...' : isWishlisted ? '♥ Remove from Wishlist' : '♡ Add to Wishlist'}
          </button>
        </div>
        {cartError && <p className="form-error" role="alert">{cartError}</p>}
        {error && <p className="form-error" role="alert">{error}</p>}
      </div>
    </article>
  )
}

export default ProductCard