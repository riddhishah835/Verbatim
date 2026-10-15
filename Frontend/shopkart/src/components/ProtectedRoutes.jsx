import React from 'react'
import { useAuth } from '../context/AuthContext.jsx'
import { useNavigate } from 'react-router-dom'
function ProtectedRoutes({children}) {
  const navigate = useNavigate()
  const {customer, loader} = useAuth()
  if (loader) {
    return <div className="loading-screen">Loading...</div>
  }
  if (!customer) {
    navigate('/Login', { replace: true })
    return null
  }
  return children
}
export default ProtectedRoutes