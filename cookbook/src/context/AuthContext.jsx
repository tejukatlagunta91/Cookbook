import { createContext, useContext, useState, useEffect, useMemo } from 'react'

const AuthContext = createContext()

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}

const AUTH_STORAGE_KEY = 'cookbook_user'

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem(AUTH_STORAGE_KEY)
      return saved ? JSON.parse(saved) : null
    } catch (error) {
      console.error('Failed to read auth user:', error)
      return null
    }
  })

  useEffect(() => {
    try {
      if (user) {
        localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user))
      } else {
        localStorage.removeItem(AUTH_STORAGE_KEY)
      }
    } catch (error) {
      console.error('Failed to persist auth user:', error)
    }
  }, [user])

  const login = async ({ email, password }) => {
    // In a real app, replace with API call. Here we just simulate auth.
    // Accept any non-empty credentials.
    if (!email || !password) {
      throw new Error('Email and password are required')
    }
    const fakeUser = { email }
    setUser(fakeUser)
    return fakeUser
  }

  const logout = () => {
    setUser(null)
  }

  const value = useMemo(
    () => ({
      user,
      login,
      logout,
      isAuthenticated: Boolean(user),
    }),
    [user],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

