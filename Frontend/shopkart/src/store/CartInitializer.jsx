import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { useAuth } from '../context/AuthContext.jsx'
import { clearCart, fetchCart } from './cartSlice'

function CartInitializer() {
  const dispatch = useDispatch()
  const { customer, loader: authLoading } = useAuth()

  useEffect(() => {
    if (authLoading) return
    if (!customer) {
      dispatch(clearCart())
      return
    }

    dispatch(fetchCart())
  }, [authLoading, customer, dispatch])

  return null
}

export default CartInitializer
