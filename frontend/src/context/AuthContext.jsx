import { createContext, useContext, useState, useCallback, useEffect } from 'react'
import api from '../services/api'

const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [token, setToken] = useState(localStorage.getItem('token'))

  useEffect(() => {
    const checkAuth = async () => {
      if (token) {
        try {
          const response = await api.get('/users/current-user')
          setUser(response.data.data)
          setError(null)
        } catch (err) {
          console.error('Auth check failed:', err)
          setToken(null)
          localStorage.removeItem('token')
        }
      }
      setLoading(false)
    }

    checkAuth()
  }, [token])

  const register = useCallback(async (formData) => {
    setLoading(true)
    setError(null)
    try {
      const response = await api.post('/users/register', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      const { accessToken: newToken, user: userData } = response.data.data
      localStorage.setItem('token', newToken)
      setToken(newToken)
      setUser(userData)
      return { success: true, data: userData }
    } catch (err) {
      const message = err.response?.data?.message || 'Registration failed'
      setError(message)
      return { success: false, error: message }
    } finally {
      setLoading(false)
    }
  }, [])

  const login = useCallback(async (email, password) => {
    setLoading(true)
    setError(null)
    try {
      const response = await api.post('/users/login', { email, password })
      const { accessToken: newToken, user: userData } = response.data.data
      localStorage.setItem('token', newToken)
      setToken(newToken)
      setUser(userData)
      return { success: true, data: userData }
    } catch (err) {
      const message = err.response?.data?.message || 'Login failed'
      setError(message)
      return { success: false, error: message }
    } finally {
      setLoading(false)
    }
  }, [])

  const logout = useCallback(() => {
    localStorage.removeItem('token')
    setToken(null)
    setUser(null)
    setError(null)
  }, [])

  const updateProfile = useCallback(async (updates) => {
    setError(null)
    try {
      const response = await api.post('/users/update-account', updates)
      setUser(response.data.data)
      return { success: true, data: response.data.data }
    } catch (err) {
      const message = err.response?.data?.message || 'Update failed'
      setError(message)
      return { success: false, error: message }
    }
  }, [])

  const value = {
    user,
    setUser,
    loading,
    error,
    token,
    isAuthenticated: !!token && !!user,
    register,
    login,
    logout,
    updateProfile,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}
