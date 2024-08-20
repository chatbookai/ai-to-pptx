'use client'

// ** React Imports
import { createContext, useEffect, useState, ReactNode } from 'react'

// ** Types
import { AuthValuesType, UserDataType } from './types'

// ** Defaults
const defaultProvider: AuthValuesType = {
  user: null,
  setUser: () => null,
  loading: true,
  setLoading: () => Boolean,
}

const AuthContext = createContext(defaultProvider)

type Props = {
  children: ReactNode
}

const AuthProvider = ({ children }: Props) => {
  // ** States
  const [user, setUser] = useState<UserDataType | null>(defaultProvider.user)
  const [loading, setLoading] = useState<boolean>(defaultProvider.loading)

  useEffect(() => {
    const user = {id: 1, role: 'admin', fullName: 'Ai to PPTX', username: 'Ai to PPTX', email: 'Ai to PPTX@gmail.com'}
    setUser(user as UserDataType)
  }, [])

  const values = {
    user,
    setUser,
    loading,
    setLoading,
  }

  return <AuthContext.Provider value={values}>{children}</AuthContext.Provider>
}

export { AuthContext, AuthProvider }
