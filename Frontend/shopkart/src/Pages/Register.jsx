import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import axiosInstance from '../axioscalls/axios'
import { useAuth } from '../context/AuthContext.jsx'

function Register() {
  const [formdata, setdata] = useState({
    fullname: "",
    email: "",
    phone: "",
    password: ""
  })
  const [loader, setloader] = useState(false)
  const [error, setError] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const navigate = useNavigate()
  const { setcustomer } = useAuth()

  const onchange = (e) => {
    const { name, value } = e.target
    setdata(prev => ({ ...prev, [name]: value }))
    if (error) setError("")
  }

  const handlesubmit = async (e) => {
    e.preventDefault()
    setError("")

    if (formdata.password.length < 6) {
      setError("Password must be at least 6 characters")
      return
    }

    setloader(true)
    try {
      const res = await axiosInstance.post('/customers/register', {
        fullname: formdata.fullname,
        email: formdata.email,
        phone: formdata.phone,
        password: formdata.password
      })
      console.log("user registered")
      setcustomer(res.data)
      navigate('/Home', { replace: true })
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed. Please try again.")
    } finally {
      setloader(false)
    }
  }

  return (
    <div className="page">
      <main className="main-content">
        <div className="container">
          <div className="card auth-card">
            <div className="auth-header">
              <h1 className="auth-title">Create Account</h1>
              <p className="auth-subtitle">Enter your details to register</p>
            </div>

            {error && (
              <div className="alert alert-error" role="alert">
                {error}
              </div>
            )}

            <form onSubmit={handlesubmit} className="heritage-form" noValidate>
              <div className="form-group">
                <label htmlFor="fullname" className="form-label">Full Name</label>
                <input
                  type="text"
                  id="fullname"
                  name="fullname"
                  placeholder="Enter your full name"
                  onChange={onchange}
                  value={formdata.fullname}
                  className="form-input"
                  required
                  autoComplete="name"
                  disabled={loader}
                />
              </div>

              <div className="form-group">
                <label htmlFor="email" className="form-label">Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  placeholder="your@email.com"
                  onChange={onchange}
                  value={formdata.email}
                  className="form-input"
                  required
                  autoComplete="email"
                  disabled={loader}
                />
              </div>

              <div className="form-group">
                <label htmlFor="phone" className="form-label">Phone Number</label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  placeholder="Enter your phone number"
                  onChange={onchange}
                  value={formdata.phone}
                  className="form-input"
                  required
                  autoComplete="tel"
                  disabled={loader}
                />
              </div>

              <div className="form-group">
                <label htmlFor="password" className="form-label">Password</label>
                <div style={{ position: 'relative' }}>
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    name="password"
                    placeholder="Create a password"
                    onChange={onchange}
                    value={formdata.password}
                    className="form-input"
                    required
                    autoComplete="new-password"
                    disabled={loader}
                    minLength={6}
                    style={{ paddingRight: '40px' }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    style={{
                      position: 'absolute',
                      right: '12px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      color: 'var(--color-text-muted)',
                      padding: '4px'
                    }}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? (
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                        <line x1="1" y1="1" x2="23" y2="23" />
                      </svg>
                    ) : (
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                        <circle cx="12" cy="12" r="3" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className="btn btn-primary btn-lg btn-block"
                disabled={loader}
              >
                {loader ? (
                  <>
                    <span className="spinner" aria-hidden="true" />
                    Creating account...
                  </>
                ) : (
                  'Create Account'
                )}
              </button>
            </form>

            <div className="auth-footer">
              Already have an account? <Link to="/Login" className="link">Login</Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default Register