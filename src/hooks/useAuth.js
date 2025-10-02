import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabaseClient'

export const useAuth = () => {
  const [user, setUser] = useState(null)
  const [authLoading, setAuthLoading] = useState(true)
  const [session, setSession] = useState(null)

  useEffect(() => {
    // Obter sessão inicial
    const getInitialSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession()
        
        if (error) {
          console.error('Erro ao obter sessão:', error)
        } else {
          setSession(session)
          setUser(session?.user ?? null)
        }
      } catch (err) {
        console.error('Erro ao verificar autenticação:', err)
      } finally {
        setAuthLoading(false)
      }
    }

    getInitialSession()

    // Escutar mudanças de autenticação
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session?.user?.id)
        
        setSession(session)
        setUser(session?.user ?? null)
        setAuthLoading(false)

        // Atualizar localStorage para compatibilidade com ProtectedRoute existente
        if (session?.user) {
          localStorage.setItem('isAuthenticated', 'true')
        } else {
          localStorage.removeItem('isAuthenticated')
        }
      }
    )

    return () => {
      subscription?.unsubscribe()
    }
  }, [])

  const signOut = async () => {
    try {
      setAuthLoading(true)
      const { error } = await supabase.auth.signOut()
      if (error) throw error
      
      localStorage.removeItem('isAuthenticated')
    } catch (error) {
      console.error('Erro ao fazer logout:', error)
    } finally {
      setAuthLoading(false)
    }
  }

  return {
    user,
    session,
    authLoading,
    signOut,
    isAuthenticated: !!user
  }
}

