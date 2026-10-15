import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import Navbar from '../components/Navbar'
import axiosInstance from '../axioscalls/axios'

function OrderDetails() {
  const { id } = useParams()
  const [order, setOrder] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const loadOrder = async () => {
      try {
        const response = await axiosInstance.get(`/orders/${id}`)
        setOrder(response.data.order)
      } catch (requestError) {
        setError(requestError.response?.data?.message || 'Unable to load this order.')
      } finally {
        setLoading(false)
      }
    }
    loadOrder()
  }, [id])

  return (
    <div className="cart-page">
      <Navbar />
      <main className="cart-shell">
        {loading ? (
          <p role="status">Loading order...</p>
        ) : error ? (
          <div className="cart-message" role="alert">
            <p>{error}</p>
            <Link to="/orders" className="btn btn-secondary">Back to My Orders</Link>
          </div>
        ) : (
          <>
            {order.status === 'PLACED' && (
              <div className="order-success-message">
                <h1>Order Placed Successfully</h1>
                <p>Your payment was verified and your order has been saved.</p>
              </div>
            )}
            <section className="order-card order-details">
              <h2>Order #{order._id}</h2>
              <p>Placed on {new Date(order.createdAt).toLocaleDateString('en-IN')}</p>
              <ul>
                {order.items.map((item) => (
                  <li key={`${item.product}-${item.name}`}>
                    <span>{item.name} × {item.quantity}</span>
                    <span>₹{(item.price * item.quantity).toLocaleString('en-IN')}</span>
                  </li>
                ))}
              </ul>
              <p><strong>Total</strong><strong>₹{order.totalAmount.toLocaleString('en-IN')}</strong></p>
              <p><span>Payment</span><span>{order.paymentStatus}</span></p>
              <p><span>Status</span><span>{order.status.replaceAll('_', ' ')}</span></p>
              <h3>Shipping Details</h3>
              <p>{order.shippingAddress.fullName}</p>
              <p>{order.shippingAddress.addressLine1}, {order.shippingAddress.city}</p>
              <p>{order.shippingAddress.state} {order.shippingAddress.pincode}</p>
              <p>{order.shippingAddress.phone}</p>
              <div className="order-actions">
                <Link to="/orders" className="btn btn-secondary">View My Orders</Link>
                <Link to="/Products" className="btn btn-primary">Continue Shopping</Link>
              </div>
            </section>
          </>
        )}
      </main>
    </div>
  )
}

export default OrderDetails
