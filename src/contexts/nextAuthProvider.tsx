'use client'

// Third-party Imports
// @ts-ignore
import { SessionProvider } from 'next-auth/react'

// @ts-ignore
import type { SessionProviderProps } from 'next-auth/react'

export const NextAuthProvider = ({ children, ...rest }: SessionProviderProps) => {
  return <SessionProvider {...rest}>{children}</SessionProvider>
}
