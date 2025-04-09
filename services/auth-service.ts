import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  sendEmailVerification,
  updateProfile,
  signOut,
  type User,
} from "firebase/auth"
import { auth } from "@/lib/firebase"

export interface AuthResult {
  success: boolean
  message: string
  user?: User
  verificationEmailSent?: boolean
}

export const signup = async (email: string, password: string, displayName: string): Promise<AuthResult> => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password)
    const user = userCredential.user

    // Update the user profile with the display name
    await updateProfile(user, { displayName })

    // Send verification email and handle potential errors
    const verificationResult = await sendVerificationEmail(user)

    return {
      success: true,
      user,
      verificationEmailSent: verificationResult.success,
      message: verificationResult.success
        ? "Account created successfully! Please check your email to verify your account."
        : `Account created successfully! ${verificationResult.message}`,
    }
  } catch (error: any) {
    console.error("Signup error:", error)

    if (error.code === "auth/email-already-in-use") {
      return {
        success: false,
        message: "This email is already registered. Please use a different email or try logging in.",
      }
    }

    return { success: false, message: error.message || "Failed to create account" }
  }
}

export const login = async (email: string, password: string): Promise<AuthResult> => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password)
    return {
      success: true,
      user: userCredential.user,
      message: "Logged in successfully!",
    }
  } catch (error: any) {
    console.error("Login error:", error)

    if (error.code === "auth/user-not-found" || error.code === "auth/wrong-password") {
      return { success: false, message: "Invalid email or password" }
    }

    return { success: false, message: error.message || "Failed to log in" }
  }
}

export const logout = async (): Promise<AuthResult> => {
  try {
    await signOut(auth)
    return { success: true, message: "Logged out successfully!" }
  } catch (error: any) {
    console.error("Logout error:", error)
    return { success: false, message: error.message || "Failed to log out" }
  }
}

export const sendPasswordReset = async (email: string): Promise<AuthResult> => {
  try {
    await sendPasswordResetEmail(auth, email)
    return { success: true, message: "Password reset email sent!" }
  } catch (error: any) {
    console.error("Password reset error:", error)

    // Handle the invalid-sender error gracefully
    if (error.code === "auth/invalid-sender") {
      return {
        success: false,
        message: "Unable to send password reset email due to a configuration issue. Please contact support.",
      }
    }

    return {
      success: false,
      message: error.message || "Failed to send password reset email",
    }
  }
}

export const sendVerificationEmail = async (user: User): Promise<AuthResult> => {
  try {
    await sendEmailVerification(user)
    return { success: true, message: "Verification email sent!" }
  } catch (error: any) {
    console.error("Email verification error:", error)

    // Handle the invalid-sender error gracefully
    if (error.code === "auth/invalid-sender") {
      return {
        success: false,
        message:
          "Your account has been created, but we could not send a verification email due to a configuration issue. Please contact support.",
      }
    }

    return {
      success: false,
      message: error.message || "Failed to send verification email",
    }
  }
}

export const getCurrentUser = (): User | null => {
  return auth.currentUser
}
