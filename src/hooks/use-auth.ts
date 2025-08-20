'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

export function useAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    // Verificar se o usuário está autenticado
    const checkAuth = () => {
      const auth = localStorage.getItem('isAuthenticated')
      setIsAuthenticated(auth === 'true')
      setIsLoading(false)
    }

    checkAuth()
  }, [])

  const login = () => {
    localStorage.setItem('isAuthenticated', 'true')
    setIsAuthenticated(true)
  }

  const logout = () => {
    localStorage.removeItem('isAuthenticated')
    setIsAuthenticated(false)
    router.push('/login')
  }

  return {
    isAuthenticated,
    isLoading,
    login,
    logout
  }
}