import React, { useCallback, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import WishlistCard from '../components/WishlistCard'
import axiosInstance from '../axioscalls/axios'

function Wishlist() {
  const [wishlist, setWishlist] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const fetchWishlist = useCallback(async () => {
    try {
      const response = await axiosInstance.get('/wishlist')
      setWishlist(response.data.wishlist)
    } catch (requestError) {
      console.error('Unable to load wishlist:', requestError)
      setError(requestError.response?.data?.message || 'Unable to load wishlist.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchWishlist()
  }, [fetchWishlist])

  const retryFetch = () => {
    setLoading(true)
    setError('')
    fetchWishlist()
  }

  return (
    <div className="wishlist-page">
      <Navbar />

      <main className="wishlist-shell">
        <header className="wishlist-header">
          <h1 className="wishlist-title">My Wishlist</h1>
          {!loading && !error && (
            <p className="wishlist-count">
              {wishlist.length} {wishlist.length === 1 ? 'product' : 'products'} saved
            </p>
          )}
        </header>

        {loading ? (
          <p className="wishlist-message" role="status">Loading your wishlist...</p>
        ) : error ? (
          <div className="wishlist-message" role="alert">
            <h2>Something went wrong.</h2>
            <p>We couldn't load your wishlist.</p>
            <p>{error}</p>
            <button type="button" className="btn btn-primary" onClick={retryFetch}>
              Try Again
            </button>
          </div>
        ) : wishlist.length === 0 ? (
          <div className="wishlist-empty">
            <div className="wishlist-empty-icon" aria-hidden="true">
              <svg viewBox="0 0 48 48" fill="none" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M24 13.5c-5.2-4.3-11.4-4.3-17-2.1v23.2c5.6-2.2 11.8-2.2 17 2.1m0-23.2c5.2-4.3 11.4-4.3 17-2.1v23.2c-5.6-2.2-11.8-2.2-17 2.1m0-23.2v23.2" />
                <path d="M11.5 17.5c3.4-.8 6.4-.3 9 1.2M11.5 23c3.4-.8 6.4-.3 9 1.2m16-6.7c-3.4-.8-6.4-.3-9 1.2m9 4.3c-3.4-.8-6.4-.3-9 1.2" />
                <path d="m24 8 1.1 2.3L27.5 11l-2.4.8L24 14l-1.1-2.2-2.4-.8 2.4-.7L24 8Z" />
              </svg>
            </div>
            <h2 className="wishlist-empty-title">No titles on your wishlist yet</h2>
            <p className="wishlist-empty-text">Keep the books that catch your eye close at hand for another day.</p>
            <Link to="/Products" className="btn btn-primary">Browse Books</Link>
          </div>
        ) : (
          <section className="wishlist-grid" aria-label="Saved products">
            {wishlist.map((product) => (
              <WishlistCard
                key={product._id}
                product={product}
                onRemove={(productId) => setWishlist((current) =>
                  current.filter((item) => item._id !== productId))}
              />
            ))}
          </section>
        )}
      </main>
    </div>
  )
}

export default Wishlist
