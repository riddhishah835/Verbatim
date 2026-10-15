import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import axiosInstance from '../axioscalls/axios'

function WishlistCard({ product, onRemove }) {
  const [removing, setRemoving] = useState(false)
  const [error, setError] = useState('')
  const inStock = product.stock > 0

  const handleRemove = async () => {
    if (removing) return
    setRemoving(true)
    setError('')
    try {
      const response = await axiosInstance.delete(`/wishlist/${product._id}`)
      onRemove(product._id)
      window.dispatchEvent(new CustomEvent('wishlist-updated', {
        detail: { count: response.data.count },
      }))
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'Unable to remove product. Please try again.')
    } finally {
      setRemoving(false)
    }
  }

  return (
    <article className="wishlist-card">
      <div className="wishlist-image">
        {product.image ? (
          <img src={product.image} alt={product.name} />
        ) : (
          <span>Image unavailable</span>
        )}
      </div>

      <div className="wishlist-card-body">
        <h3 className="wishlist-product-name">{product.name}</h3>
        <p className="wishlist-product-meta">{product.category}</p>
        <p className="wishlist-product-price">₹{Number(product.price).toLocaleString('en-IN')}</p>
        <p className="wishlist-product-meta">
          {inStock ? `${product.stock} units left` : 'Out of stock'}
        </p>

        <div className="wishlist-card-actions">
          <Link to={`/Products/${product._id}`} className="btn btn-secondary btn-sm">
            View Details
          </Link>
          <button
            type="button"
            className="btn btn-secondary btn-sm"
            onClick={handleRemove}
            disabled={removing}
          >
            {removing ? 'Removing...' : 'Remove ♥'}
          </button>
        </div>
        {error && <p className="form-error" role="alert">{error}</p>}
      </div>
    </article>
  )
}

export default WishlistCard
