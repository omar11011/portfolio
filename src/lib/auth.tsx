'use client'

import { useState, useCallback, createContext, useContext, useEffect, useRef } from 'react'

interface AuthContextType {
  isAuthenticated: boolean
  isLoading: boolean
  login: (password: string) => Promise<boolean>
  logout: () => void
}

const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  isLoading: false,
  login: async () => false,
  logout: () => {},
})

export function useAuth() {
  return useContext(AuthContext)
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const hasCheckedRef = useRef(false)

  useEffect(() => {
    if (hasCheckedRef.current) return
    hasCheckedRef.current = true

    let cancelled = false

    async function checkSession() {
      try {
        const controller = new AbortController()
        const timeout = setTimeout(() => controller.abort(), 5000)

        const res = await fetch('/api/auth/session', {
          cache: 'no-store',
          headers: { Accept: 'application/json' },
          signal: controller.signal,
        })
        clearTimeout(timeout)

        if (cancelled) return

        if (res.ok) {
          const contentType = res.headers.get('content-type') || ''
          if (contentType.includes('application/json')) {
            const data = await res.json()
            if (data?.user) {
              setIsAuthenticated(true)
            }
          }
        }
      } catch {
        // silenciar
      }
    }

    checkSession()
    return () => { cancelled = true }
  }, [])

  const login = useCallback(async (password: string): Promise<boolean> => {
    setIsLoading(true)
    try {
      const res = await fetch('/api/auth/callback/credentials', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          Accept: 'application/json',
        },
        body: new URLSearchParams({
          password,
          csrfToken: await getCsrfToken(),
          json: 'true',
        }),
      })

      if (!res.ok) return false

      const contentType = res.headers.get('content-type') || ''
      if (!contentType.includes('application/json')) return false

      const data = await res.json()
      if (data?.error) {
        return false
      }

      setIsAuthenticated(true)
      return true
    } catch {
      return false
    } finally {
      setIsLoading(false)
    }
  }, [])

  const logout = useCallback(async () => {
    try {
      await fetch('/api/auth/signout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          csrfToken: await getCsrfToken(),
        }),
      })
    } catch {

    }
    setIsAuthenticated(false)
  }, [])

  return (
    <AuthContext.Provider value={{ isAuthenticated, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}


async function getCsrfToken(): Promise<string> {
  try {
    const res = await fetch('/api/auth/csrf', {
      headers: { Accept: 'application/json' },
    })
    if (res.ok) {
      const contentType = res.headers.get('content-type') || ''
      if (contentType.includes('application/json')) {
        const data = await res.json()
        return data?.csrfToken || ''
      }
    }
    return ''
  } catch {
    return ''
  }
}
