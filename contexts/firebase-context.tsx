"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import {
  type User,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  updateProfile,
  sendPasswordResetEmail,
  sendEmailVerification,
  EmailAuthProvider,
  GoogleAuthProvider,
  signInWithPopup,
  linkWithPopup,
  unlink,
  reauthenticateWithCredential,
  getAdditionalUserInfo,
} from "firebase/auth"
import { auth, db } from "@/lib/firebase"
import { doc, setDoc, getDoc, serverTimestamp } from "firebase/firestore"

// Update the UserRole type to include admin
export type UserRole = "athlete" | "trainer" | "coach" | "admin"

// Add isAdmin property to AuthContextType
type AuthContextType = {
  user: User | null
  userRole: UserRole | null
  loading: boolean
  isAdmin: boolean
  signIn: (email: string, password: string) => Promise<void>
  signInWithGoogle: () => Promise<void>
  signUp: (email: string, password: string, name: string, userRole: UserRole) => Promise<void>
  signOut: () => Promise<void>
  resetPassword: (email: string) => Promise<void>
  updateUserProfile: (displayName: string, photoURL?: string) => Promise<void>
  updateUserRole: (role: UserRole) => Promise<void>
  sendVerificationEmail: () => Promise<void>
  reauthenticate: (password: string) => Promise<void>
  linkGoogleAccount: () => Promise<void>
  unlinkGoogleAccount: () => Promise<void>
  getLinkedProviders: () => string[]
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [userRole, setUserRole] = useState<UserRole | null>(null)
  const [loading, setLoading] = useState(true)
  const [isAdmin, setIsAdmin] = useState(false)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      console.log("Firebase auth user:", user)
      console.log("User photo URL:", user?.photoURL)

      setUser(user)

      if (user) {
        try {
          // Fetch user role from Firestore
          const userDoc = await getDoc(doc(db, "users", user.uid))
          if (userDoc.exists()) {
            const userData = userDoc.data()
            setUserRole(userData.userRole as UserRole)

            // Check if user is admin
            setIsAdmin(userData.userRole === "admin" || user.email === "info@myx1sports.com")
          } else {
            setUserRole(null)
            setIsAdmin(false)
          }
        } catch (error) {
          console.error("Error fetching user role:", error)
          setUserRole(null)
          setIsAdmin(false)
        }
      } else {
        setUserRole(null)
        setIsAdmin(false)
      }

      setLoading(false)
    })

    return () => unsubscribe()
  }, [])

  const signIn = async (email: string, password: string) => {
    try {
      await signInWithEmailAndPassword(auth, email, password)

      // Fetch user role after sign in
      if (auth.currentUser) {
        const userDoc = await getDoc(doc(db, "users", auth.currentUser.uid))
        if (userDoc.exists()) {
          const userData = userDoc.data()
          setUserRole(userData.userRole as UserRole)
        }
      }
    } catch (error: any) {
      console.error("Error signing in:", error)
      throw new Error(error.message)
    }
  }

  // Add Google sign-in method
  const signInWithGoogle = async () => {
    try {
      const provider = new GoogleAuthProvider()
      const result = await signInWithPopup(auth, provider)
      const user = result.user

      // Check if this is a new user
      const isNewUser = getAdditionalUserInfo(result)?.isNewUser

      if (isNewUser) {
        // Create a new user document in Firestore
        await setDoc(doc(db, "users", user.uid), {
          uid: user.uid,
          email: user.email,
          displayName: user.displayName,
          photoURL: user.photoURL,
          userRole: "athlete", // Default role for Google sign-ins
          emailVerified: user.emailVerified,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        })

        setUserRole("athlete")
      } else {
        // Fetch existing user role
        const userDoc = await getDoc(doc(db, "users", user.uid))
        if (userDoc.exists()) {
          const userData = userDoc.data()
          setUserRole(userData.userRole as UserRole)
        }
      }
    } catch (error: any) {
      console.error("Error signing in with Google:", error)
      throw new Error(error.message)
    }
  }

  const signUp = async (email: string, password: string, name: string, userRole: UserRole) => {
    try {
      // Create the user
      const userCredential = await createUserWithEmailAndPassword(auth, email, password)

      // Update the user profile with the name
      await updateProfile(userCredential.user, {
        displayName: name,
      })

      // Send verification email
      await sendEmailVerification(userCredential.user)

      // Create a user document in Firestore
      await setDoc(doc(db, "users", userCredential.user.uid), {
        uid: userCredential.user.uid,
        email,
        displayName: name,
        userRole,
        emailVerified: false,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      })

      // Set the user role in state
      setUserRole(userRole)

      return userCredential
    } catch (error: any) {
      console.error("Error signing up:", error)
      // Preserve the original error with its code
      throw error
    }
  }

  const signOut = async () => {
    try {
      await firebaseSignOut(auth)
      setUserRole(null)
    } catch (error: any) {
      console.error("Error signing out:", error)
      throw new Error(error.message)
    }
  }

  const resetPassword = async (email: string) => {
    try {
      await sendPasswordResetEmail(auth, email)
    } catch (error: any) {
      console.error("Error resetting password:", error)
      throw new Error(error.message)
    }
  }

  const updateUserProfile = async (displayName: string, photoURL?: string) => {
    try {
      if (!auth.currentUser) throw new Error("No user is signed in")

      await updateProfile(auth.currentUser, {
        displayName,
        photoURL: photoURL || auth.currentUser.photoURL,
      })

      // Update the user document in Firestore
      await setDoc(
        doc(db, "users", auth.currentUser.uid),
        {
          displayName,
          photoURL: photoURL || auth.currentUser.photoURL,
          updatedAt: serverTimestamp(),
        },
        { merge: true },
      )
    } catch (error: any) {
      console.error("Error updating profile:", error)
      throw new Error(error.message)
    }
  }

  const updateUserRole = async (role: UserRole) => {
    try {
      if (!auth.currentUser) throw new Error("No user is signed in")

      // Update the user document in Firestore
      await setDoc(
        doc(db, "users", auth.currentUser.uid),
        {
          userRole: role,
          updatedAt: serverTimestamp(),
        },
        { merge: true },
      )

      // Update local state
      setUserRole(role)
    } catch (error: any) {
      console.error("Error updating user role:", error)
      throw new Error(error.message)
    }
  }

  const sendVerificationEmail = async () => {
    try {
      if (!auth.currentUser) throw new Error("No user is signed in")
      await sendEmailVerification(auth.currentUser)
    } catch (error: any) {
      console.error("Error sending verification email:", error)
      throw new Error(error.message)
    }
  }

  const reauthenticate = async (password: string) => {
    try {
      if (!auth.currentUser || !auth.currentUser.email) throw new Error("No user is signed in")
      const credential = EmailAuthProvider.credential(auth.currentUser.email, password)
      await reauthenticateWithCredential(auth.currentUser, credential)
    } catch (error: any) {
      console.error("Error reauthenticating:", error)
      throw new Error(error.message)
    }
  }

  // Add method to link Google account
  const linkGoogleAccount = async () => {
    try {
      if (!auth.currentUser) throw new Error("No user is signed in")

      const provider = new GoogleAuthProvider()
      await linkWithPopup(auth.currentUser, provider)
    } catch (error: any) {
      console.error("Error linking Google account:", error)
      throw new Error(error.message)
    }
  }

  // Add method to unlink Google account
  const unlinkGoogleAccount = async () => {
    try {
      if (!auth.currentUser) throw new Error("No user is signed in")

      await unlink(auth.currentUser, GoogleAuthProvider.PROVIDER_ID)
    } catch (error: any) {
      console.error("Error unlinking Google account:", error)
      throw new Error(error.message)
    }
  }

  // Add method to get linked providers
  const getLinkedProviders = () => {
    if (!auth.currentUser) return []

    return auth.currentUser.providerData.map((provider) => provider.providerId)
  }

  // Include new functions in the context value
  const value = {
    user,
    userRole,
    loading,
    isAdmin,
    signIn,
    signInWithGoogle,
    signUp,
    signOut,
    resetPassword,
    updateUserProfile,
    updateUserRole,
    sendVerificationEmail,
    reauthenticate,
    linkGoogleAccount,
    unlinkGoogleAccount,
    getLinkedProviders,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
