import { initializeApp, getApps, cert } from "firebase-admin/app"
import { getAuth } from "firebase-admin/auth"
import { getFirestore } from "firebase-admin/firestore"

// Initialize Firebase Admin SDK
const apps = getApps()

if (!apps.length) {
  try {
    // Parse the service account key from environment variable
    const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY || "{}")

    initializeApp({
      credential: cert(serviceAccount),
      projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    })

    console.log("Firebase Admin initialized successfully")
  } catch (error) {
    console.error("Error initializing Firebase Admin:", error)
  }
}

export const adminAuth = getAuth()
export const adminDb = getFirestore()
