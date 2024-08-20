export type ErrCallbackType = (err: { [key: string]: string }) => void

export type LoginParams = {
  email: string
  password: string
  rememberMe?: boolean
}

export type UserDataType = {
  id: number
  role: string
  email: string
  fullName: string
  username: string
  password: string
  avatar?: string | null
}

export type AuthValuesType = {
  user: UserDataType | null
  setUser: (value: UserDataType | null) => void
  loading: boolean
  setLoading: (value: boolean) => void
  connected: boolean
  address: string | undefined,
  addresses: string[],
  api: any,
  profileModal: any,
  publicKey: string | undefined,
  permissions: string[],
  walletNames: any,
  strategy: string | boolean,
  currentAddress: string, 
  currentWallet: any
}
