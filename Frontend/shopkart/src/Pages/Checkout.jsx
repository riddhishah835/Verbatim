import { useState } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import Navbar from '../components/Navbar'
import { useAuth } from '../context/AuthContext.jsx'
import axiosInstance from '../axioscalls/axios'
import { clearCart } from '../store/cartSlice'

const loadRazorpayScript = () => {
  if (window.Razorpay) return Promise.resolve(true)

  const existingScript = document.querySelector('#razorpay-checkout')
  if (existingScript) return Promise.resolve(false)

  return new Promise((resolve) => {
    const script = document.createElement('script')
    script.id = 'razorpay-checkout'
    script.src = 'https://checkout.razorpay.com/v1/checkout.js'
    script.onload = () => resolve(true)
    script.onerror = () => {
      script.remove()
      resolve(false)
    }
    document.body.appendChild(script)
  })
}

const emptyAddress = {
  fullName: '',
  phone: '',
  addressLine1: '',
  city: '',
  state: '',
  pincode: '',
}

function Checkout() {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { customer } = useAuth()
  const { cartItems, loading } = useSelector((state) => state.cart)
  const [shippingAddress, setShippingAddress] = useState({
    ...emptyAddress,
    fullName: customer?.fullname || '',
    phone: customer?.phone || '',
  })
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [serverSummary, setServerSummary] = useState(null)

  const totalItems = cartItems.reduce((total, item) => total + item.quantity, 0)
  const subtotal = cartItems.reduce(
    (total, item) => total + item.product.price * item.quantity,
    0,
  )

  if (!loading && cartItems.length === 0) {
    return <Navigate to="/cart" replace />
  }

  const handleChange = (event) => {
    setShippingAddress((current) => ({
      ...current,
      [event.target.name]: event.target.value,
    }))
    setError('')
  }

  const validateAddress = () => {
    const cleanAddress = Object.fromEntries(
      Object.entries(shippingAddress).map(([field, value]) => [field, value.trim()]),
    )
    if (Object.values(cleanAddress).some((value) => !value)) {
      return 'Please fill in every shipping detail.'
    }
    if (!/^[6-9]\d{9}$/.test(cleanAddress.phone)) {
      return 'Phone number must be a valid 10-digit Indian mobile number.'
    }
    if (!/^\d{6}$/.test(cleanAddress.pincode)) {
      return 'Pincode must contain 6 digits.'
    }
    return ''
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    console.log('[checkout] Submit event received')
    const validationError = validateAddress()
    if (validationError) {
      console.log('[checkout] Validation stopped submission:', validationError)
      setError(validationError)
      return
    }

    console.log('[checkout] Address validation passed; starting payment setup')
    setSubmitting(true)
    setError('')

    try {
      const scriptLoaded = await loadRazorpayScript()
      if (!scriptLoaded) {
        throw new Error('Unable to load Razorpay. Check your connection and try again.')
      }
      console.log('[checkout] Razorpay checkout script loaded')

      const response = await axiosInstance.post('/orders/create-payment-order', {
        shippingAddress: Object.fromEntries(
          Object.entries(shippingAddress).map(([field, value]) => [field, value.trim()]),
        ),
      })
      const paymentOrder = response.data
      console.log('[checkout] Payment order created', {
        status: response.status,
        verbatimOrderId: paymentOrder.verbatimOrderId,
      })
      setServerSummary({
        items: paymentOrder.items,
        totalAmount: paymentOrder.totalAmount,
      })
      const payment = new window.Razorpay({
        key: paymentOrder.key,
        amount: paymentOrder.amount,
        currency: paymentOrder.currency,
        name: 'Verbatim',
        description: 'Verbatim order',
        order_id: paymentOrder.razorpayOrderId,
        prefill: {
          name: shippingAddress.fullName.trim(),
          contact: shippingAddress.phone.trim(),
        },
        handler: async (paymentResponse) => {
          try {
            const verifiedPayment = await axiosInstance.post('/orders/verify-payment', {
              verbatimOrderId: paymentOrder.verbatimOrderId,
              razorpay_order_id: paymentResponse.razorpay_order_id,
              razorpay_payment_id: paymentResponse.razorpay_payment_id,
              razorpay_signature: paymentResponse.razorpay_signature,
            })
            console.log('[checkout] Payment signature verified')
            dispatch(clearCart())
            navigate(`/order-success/${verifiedPayment.data.order._id}`)
          } catch (paymentError) {
            console.error('[checkout] Payment verification failed', {
              status: paymentError.response?.status,
              message: paymentError.response?.data?.message || paymentError.message,
            })
            setError(
              paymentError.response?.data?.message ||
              'Payment could not be verified. Your cart has not been cleared.',
            )
            setSubmitting(false)
          }
        },
        modal: {
          ondismiss: () => {
            setError('Payment was cancelled. Your cart has not been cleared.')
            setSubmitting(false)
          },
        },
      })

      payment.on('payment.failed', (paymentFailure) => {
        const failure = paymentFailure?.error || {}
        const failureDetails = {
          code: failure.code,
          description: failure.description,
          source: failure.source,
          step: failure.step,
          reason: failure.reason,
        }
        console.error('[checkout] Razorpay reported payment failure', failureDetails)
        setError(
          `${failure.description || 'Payment was declined.'} Your cart has not been cleared. Please try again.`,
        )
        setSubmitting(false)
      })
      payment.open()
      console.log('[checkout] Razorpay payment window opened')
    } catch (requestError) {
      console.error('[checkout] Could not start checkout', {
        status: requestError.response?.status,
        message: requestError.response?.data?.message || requestError.message,
      })
      setError(
        requestError.response?.data?.message ||
        requestError.message ||
        'Unable to start payment. Please try again.',
      )
      setSubmitting(false)
    }
  }

  return (
    <div className="cart-page">
      <Navbar />
      <main className="cart-shell">
        <h1 className="cart-title">Checkout</h1>

        {loading ? (
          <p role="status">Loading your cart...</p>
        ) : (
          <div className="checkout-layout">
            <form className="checkout-form" onSubmit={handleSubmit} noValidate>
              <h2>Shipping Details</h2>

              {error && <p className="form-error" role="alert">{error}</p>}

              <div className="form-group">
                <label htmlFor="fullName" className="form-label">Full Name</label>
                <input
                  className="form-input"
                  id="fullName"
                  name="fullName"
                  value={shippingAddress.fullName}
                  onChange={handleChange}
                  autoComplete="name"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="phone" className="form-label">Phone Number</label>
                <input
                  className="form-input"
                  id="phone"
                  name="phone"
                  type="tel"
                  inputMode="numeric"
                  maxLength={10}
                  value={shippingAddress.phone}
                  onChange={handleChange}
                  autoComplete="tel"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="addressLine1" className="form-label">Address</label>
                <input
                  className="form-input"
                  id="addressLine1"
                  name="addressLine1"
                  value={shippingAddress.addressLine1}
                  onChange={handleChange}
                  autoComplete="street-address"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="city" className="form-label">City</label>
                <input
                  className="form-input"
                  id="city"
                  name="city"
                  value={shippingAddress.city}
                  onChange={handleChange}
                  autoComplete="address-level2"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="state" className="form-label">State</label>
                <input
                  className="form-input"
                  id="state"
                  name="state"
                  value={shippingAddress.state}
                  onChange={handleChange}
                  autoComplete="address-level1"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="pincode" className="form-label">Pincode</label>
                <input
                  className="form-input"
                  id="pincode"
                  name="pincode"
                  inputMode="numeric"
                  maxLength={6}
                  value={shippingAddress.pincode}
                  onChange={handleChange}
                  autoComplete="postal-code"
                  required
                />
              </div>

              <button
                type="submit"
                className="btn btn-primary btn-block"
                disabled={submitting}
                onClick={() => console.log('[checkout] Place Order button clicked')}
              >
                {submitting ? 'Starting payment...' : 'Place Order'}
              </button>
              <Link to="/cart" className="checkout-back-link">Back to Cart</Link>
            </form>

            <aside className="cart-summary checkout-summary">
              <h2>Order Summary</h2>
              {(serverSummary?.items || cartItems.map(({ product, quantity }) => ({
                ...product,
                quantity,
              }))).map((item) => (
                <p key={item.product?._id || item._id}>
                  <span>{item.name} × {item.quantity}</span>
                  <span>₹{(item.price * item.quantity).toLocaleString('en-IN')}</span>
                </p>
              ))}
              <p><span>Items</span><span>{totalItems}</span></p>
              <p className="checkout-total">
                <strong>Total</strong>
                <strong>₹{(serverSummary?.totalAmount ?? subtotal).toLocaleString('en-IN')}</strong>
              </p>
            </aside>
          </div>
        )}
      </main>
    </div>
  )
}

export default Checkout
