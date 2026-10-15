import { Link } from 'react-router-dom'
import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Navbar from '../components/Navbar'
import { fetchCart, removeFromCart, updateCartQuantity } from '../store/cartSlice'

function Cart() {
  const dispatch = useDispatch()
  const { cartItems, loading, error, pendingProductIds } = useSelector((state) => state.cart)
  const [actionError, setActionError] = useState('')
  const totalItems = cartItems.reduce((total, item) => total + item.quantity, 0)

  const handleQuantityChange = async (productId, quantity) => {
    setActionError('')
    try {
      await dispatch(updateCartQuantity(productId, quantity))
    } catch (requestError) {
      setActionError(requestError.response?.data?.message || 'Unable to update cart.')
    }
  }

  const handleRemove = async (productId) => {
    setActionError('')
    try {
      await dispatch(removeFromCart(productId))
    } catch (requestError) {
      setActionError(requestError.response?.data?.message || 'Unable to remove product.')
    }
  }

  const subtotal = cartItems.reduce(
    (total, item) => total + item.product.price * item.quantity,
    0,
  )

  return (
    <div className="cart-page">
      <Navbar />
      <main className="cart-shell">
        <h1 className="cart-title">My Cart</h1>

        {loading ? (
          <p role="status">Loading your cart...</p>
        ) : error ? (
          <div className="cart-message" role="alert">
            <p>Unable to load your cart.</p>
            <button type="button" className="btn btn-primary" onClick={() => dispatch(fetchCart())}>
              Try Again
            </button>
          </div>
        ) : cartItems.length === 0 ? (
          <div className="cart-message">
            <div className="cart-empty-icon" aria-hidden="true">
              <svg viewBox="0 0 48 48" fill="none" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M24 13.5c-5.2-4.3-11.4-4.3-17-2.1v23.2c5.6-2.2 11.8-2.2 17 2.1m0-23.2c5.2-4.3 11.4-4.3 17-2.1v23.2c-5.6-2.2-11.8-2.2-17 2.1m0-23.2v23.2" />
                <path d="M11.5 17.5c3.4-.8 6.4-.3 9 1.2M11.5 23c3.4-.8 6.4-.3 9 1.2m16-6.7c-3.4-.8-6.4-.3-9 1.2m9 4.3c-3.4-.8-6.4-.3-9 1.2" />
              </svg>
            </div>
            <h2>Your reading pile is empty</h2>
            <p>Every great reading list starts with one book. Find your next favorite on the shelves.</p>
            <Link to="/Products" className="btn btn-primary">Browse Books</Link>
          </div>
        ) : (
          <>
            {actionError && <p className="form-error" role="alert">{actionError}</p>}
            <div className="cart-layout">
              <section className="cart-items" aria-label="Cart items">
                {cartItems.map(({ product, quantity }) => {
                  const isPending = pendingProductIds.includes(product._id)
                  return (
                    <article className="cart-item" key={product._id}>
                      <div className="cart-item-image">
                        {product.image
                          ? <img src={product.image} alt={product.name} />
                          : <span>Image unavailable</span>}
                      </div>
                      <div className="cart-item-details">
                        <h2>{product.name}</h2>
                        <p>₹{Number(product.price).toLocaleString('en-IN')}</p>
                        <p className="cart-stock">
                          {Math.max(0, product.stock - quantity)} units available
                        </p>
                        <div className="cart-item-actions">
                          <div className="cart-quantity" aria-label={`Quantity: ${quantity}`}>
                            <button
                              type="button"
                              onClick={() => handleQuantityChange(product._id, quantity - 1)}
                              disabled={isPending || quantity <= 1}
                              aria-label={`Decrease ${product.name} quantity`}
                            >
                              -
                            </button>
                            <span>{quantity}</span>
                            <button
                              type="button"
                              onClick={() => handleQuantityChange(product._id, quantity + 1)}
                              disabled={isPending || quantity >= product.stock}
                              aria-label={`Increase ${product.name} quantity`}
                            >
                              +
                            </button>
                          </div>
                          <button
                            type="button"
                            className="cart-remove"
                            onClick={() => handleRemove(product._id)}
                            disabled={isPending}
                          >
                            {isPending ? 'Updating...' : 'Remove'}
                          </button>
                        </div>
                      </div>
                      <strong className="cart-item-total">
                        ₹{(product.price * quantity).toLocaleString('en-IN')}
                      </strong>
                    </article>
                  )
                })}
              </section>

              <aside className="cart-summary">
                <h2>Order Summary</h2>
                <p><span>Items</span><span>{totalItems}</span></p>
                <p><span>Subtotal</span><strong>₹{subtotal.toLocaleString('en-IN')}</strong></p>
                <Link to="/checkout" className="btn btn-primary btn-block">
                  Proceed to Checkout
                </Link>
              </aside>
            </div>
          </>
        )}
      </main>
    </div>
  )
}

export default Cart
