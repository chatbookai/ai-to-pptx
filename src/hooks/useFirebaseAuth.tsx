import { useState, useEffect } from 'react'
import Firebase from 'src/configs/firebase'

interface UserType {
  email: string
  uid: string | number | null
}

const formatAuthUser = (user: UserType) => {
  return {
    uid: user.uid,
    email: user.email
  }
}

const useFirebaseAuth = () => {
  const [authUser, setAuthUser] = useState<null | UserType>(null)
  const [loading, setLoading] = useState(true)

  const authStateChanged = async (authState: any) => {
    if (!authState) {
      setAuthUser(null)
      setLoading(false)
    } else {
      setLoading(true)
      const formattedUser = formatAuthUser(authState)
      setAuthUser(formattedUser)
      setLoading(false)
    }
  }

  const resetUser = () => {
    setAuthUser(null)
    setLoading(true)
  }

  const signInWithEmailAndPassword = (email: string, password: string) =>
    Firebase.auth().signInWithEmailAndPassword(email, password)

  const createUserWithEmailAndPassword = (email: string, password: string) =>
    Firebase.auth().createUserWithEmailAndPassword(email, password)

  const signOut = () => Firebase.auth().signOut().then(resetUser)

  // listen for Firebase state change
  useEffect(() => {
    const unsubscribe = Firebase.auth().onAuthStateChanged(authStateChanged)

    return () => unsubscribe()
  }, [])

  return {
    loading,
    signOut,
    authUser,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword
  }
}

export default useFirebaseAuth
