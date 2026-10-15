import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import axiosInstance from '../axioscalls/axios'

function Orders() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const requestOrders = () => axiosInstance.get('/orders')

  const loadOrders = async () => {
    try {
      const response = await requestOrders()
      setOrders(response.data.orders)
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'Unable to load your orders.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    let active = true
    requestOrders()
      .then((response) => {
        if (active) setOrders(response.data.orders)
      })
      .catch((requestError) => {
        if (active) {
          setError(requestError.response?.data?.message || 'Unable to load your orders.')
        }
      })
      .finally(() => {
        if (active) setLoading(false)
      })

    return () => {
      active = false
    }
  }, [])

  return (
    <div className="cart-page">
      <Navbar />
      <main className="cart-shell">
        <h1 className="cart-title">My Orders</h1>

        {loading ? (
          <p role="status">Loading your orders...</p>
        ) : error ? (
          <div className="cart-message" role="alert">
            <p>{error}</p>
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => {
                setLoading(true)
                setError('')
                loadOrders()
              }}
            >
              Try Again
            </button>
          </div>
        ) : orders.length === 0 ? (
          <div className="cart-message">
            <h2>You have not placed any orders yet.</h2>
            <Link to="/Products" className="btn btn-primary">Start Shopping</Link>
          </div>
        ) : (
          <section className="orders-list" aria-label="Your orders">
            {orders.map((order) => (
              <article className="order-card" key={order._id}>
                <div className="order-card-heading">
                  <h2>Order #{order._id}</h2>
                  <span>{new Date(order.createdAt).toLocaleDateString('en-IN')}</span>
                </div>
                <ul>
                  {order.items.map((item) => (
                    <li key={`${item.product}-${item.name}`}>
                      <span>{item.name} × {item.quantity}</span>
                      <span>₹{(item.price * item.quantity).toLocaleString('en-IN')}</span>
                    </li>
                  ))}
                </ul>
                <p><strong>Total</strong><strong>₹{order.totalAmount.toLocaleString('en-IN')}</strong></p>
                <p><span>Status</span><span>{order.status.replaceAll('_', ' ')}</span></p>
                <Link to={`/order-success/${order._id}`} className="btn btn-secondary">
                  View Details
                </Link>
              </article>
            ))}
          </section>
        )}
      </main>
    </div>
  )
}

export default Orders
