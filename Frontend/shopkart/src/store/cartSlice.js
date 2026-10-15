import { createSlice } from '@reduxjs/toolkit'
import axiosInstance from '../axioscalls/axios'

const initialState = {
  cartItems: [],
  loading: true,
  error: '',
  pendingProductIds: [],
}

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    setCart(state, action) {
      state.cartItems = action.payload
    },
    setLoading(state, action) {
      state.loading = action.payload
    },
    setError(state, action) {
      state.error = action.payload
    },
    addPendingProduct(state, action) {
      state.pendingProductIds.push(action.payload)
    },
    removePendingProduct(state, action) {
      state.pendingProductIds = state.pendingProductIds
        .filter((productId) => productId !== action.payload)
    },
    clearCart(state) {
      state.cartItems = []
      state.loading = false
      state.error = ''
      state.pendingProductIds = []
    },
  },
})

export const {
  setCart,
  setLoading,
  setError,
  addPendingProduct,
  removePendingProduct,
  clearCart,
} = cartSlice.actions

export const fetchCart = () => async (dispatch) => {
  dispatch(setLoading(true))
  dispatch(setError(''))
  try {
    const response = await axiosInstance.get('/cart')
    dispatch(setCart(response.data.cart))
  } catch (error) {
    console.error('Unable to load cart:', error)
    dispatch(setError(error.response?.data?.message || 'Unable to load your cart.'))
  } finally {
    dispatch(setLoading(false))
  }
}

export const addToCart = (productId) => async (dispatch) => {
  dispatch(addPendingProduct(productId))
  try {
    const response = await axiosInstance.post(`/cart/${productId}`)
    dispatch(setCart(response.data.cart))
  } finally {
    dispatch(removePendingProduct(productId))
  }
}

export const updateCartQuantity = (productId, quantity) => async (dispatch) => {
  dispatch(addPendingProduct(productId))
  try {
    const response = await axiosInstance.patch(`/cart/${productId}`, { quantity })
    dispatch(setCart(response.data.cart))
  } finally {
    dispatch(removePendingProduct(productId))
  }
}

export const removeFromCart = (productId) => async (dispatch) => {
  dispatch(addPendingProduct(productId))
  try {
    const response = await axiosInstance.delete(`/cart/${productId}`)
    dispatch(setCart(response.data.cart))
  } finally {
    dispatch(removePendingProduct(productId))
  }
}

export default cartSlice.reducer
