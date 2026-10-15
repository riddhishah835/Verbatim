import React from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
function PublicRoutes({children}) {
  const {customer, loader} = useAuth()
  if (loader) {
    return <div className="loading-screen">Loading...</div>
  }
  if (customer) {
    return <Navigate to="/Home" replace />
  }
  return children
}
export default PublicRoutes