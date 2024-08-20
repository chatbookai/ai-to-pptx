'use client'

// ** React Imports
import { createContext, useEffect, useState, ReactNode } from 'react'

// ** Types
import { AuthValuesType, UserDataType } from './types'

import { useActiveAddress, useConnection, useApi, useProfileModal, usePublicKey, usePermissions, useAddresses, useWalletNames, useStrategy } from "arweave-wallet-kit";

// ** Defaults
const defaultProvider: AuthValuesType = {
  user: null,
  setUser: () => null,
  loading: true,
  setLoading: () => Boolean,
  connected: false,
  address: '',
  addresses: [],
  api: null,
  profileModal: null,
  publicKey: '',
  permissions: [],
  walletNames: [],
  strategy: '',
  currentAddress: '',
  currentWallet: null
}

const AuthContext = createContext(defaultProvider)

type Props = {
  children: ReactNode
}

const AuthProvider = ({ children }: Props) => {
  // ** States
  const [user, setUser] = useState<UserDataType | null>(defaultProvider.user)
  const [loading, setLoading] = useState<boolean>(defaultProvider.loading)

  const { connected } = useConnection();
  const address = useActiveAddress();
  const api = useApi();
  const profileModal = useProfileModal();
  const publicKey = usePublicKey();
  const permissions = usePermissions();
  const addresses = useAddresses();
  const walletNames = useWalletNames();
  const strategy = useStrategy();

  useEffect(() => {
    const user = {id: 1, role: 'admin', fullName: 'AoWallet', username: 'AoWallet', email: 'aowallet2024@gmail.com'}
    setUser(user as UserDataType)
  }, [])

  const values = {
    user,
    setUser,
    loading,
    setLoading,
    connected, 
    address,
    addresses,
    api,
    profileModal,
    publicKey,
    permissions,
    walletNames,
    strategy,
    currentAddress: '',
    currentWallet: null
  }

  return <AuthContext.Provider value={values}>{children}</AuthContext.Provider>
}

export { AuthContext, AuthProvider }
