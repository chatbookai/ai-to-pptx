// ** React Imports
import { createContext, useContext, ReactNode } from 'react'

const authUserContext: any = createContext({
  authUser: null,
  loading: true,
  signOut: async () => Promise.resolve(),
  signInWithEmailAndPassword: async () => Promise.resolve(),
  createUserWithEmailAndPassword: async () => Promise.resolve()
})

export const FirebaseAuthProvider = ({ children }: { children: ReactNode }) => {

  return <authUserContext.Provider value={null}>{children}</authUserContext.Provider>
}

// custom hook to use the authUserContext and access authUser and loading
export const useAuth = () => useContext(authUserContext)
