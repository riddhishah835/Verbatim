import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import axiosInstance from '../axioscalls/axios'
import { useAuth } from '../context/AuthContext.jsx'
function Login() {
  const [formdata, setdata] = useState({ email: "", password: "" })
  const [loader, setLoader] = useState(false)
  const [error, setError] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const navigate = useNavigate()
  const { setcustomer } = useAuth()
  const onchange = (e) => {
    const { name, value, type, checked } = e.target
    setdata(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }))
    if (error) setError("")
  }

  const onsubmit = async (e) => {
    e.preventDefault()
    setLoader(true)
    setError("")
    try {
      const res = await axiosInstance.post("/customers/login", formdata)
      console.log("Login successful")
      setcustomer(res.data)
      navigate('/Home', { replace: true })
    } catch (e) {
      setError(e.response?.data?.message || "Login failed. Please try again.")
    } finally {
      setLoader(false)
    }
  }
                                                    
  return (
    <div className="page">
      <main className="main-content">
        <div className="container">
          <div className="card auth-card">
            <div className="auth-header">
              <h1 className="auth-title">Login</h1>
              <p className="auth-subtitle">Enter your credentials to access your account</p>
            </div>

            {error && (
              <div className="alert alert-error" role="alert">
                {error}
              </div>
            )}

            <form onSubmit={onsubmit} className="heritage-form" noValidate>
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
                  aria-invalid={!!error}
                />
              </div>

              <div className="form-group">
                <label htmlFor="password" className="form-label">Password</label>
                <div style={{ position: 'relative' }}>
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    name="password"
                    placeholder="••••••••"
                    onChange={onchange}
                    value={formdata.password}
                    className="form-input"
                    required
                    autoComplete="current-password"
                    disabled={loader}
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
                    Logging in...
                  </>
                ) : (
                  'Login'
                )}
              </button>
            </form>

            <div className="auth-footer">
              Don't have an account? <Link to="/Register" className="link">Register</Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default Login