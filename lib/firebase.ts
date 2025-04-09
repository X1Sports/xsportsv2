import { initializeApp } from "firebase/app"
import { getFirestore } from "firebase/firestore"
import { getAuth } from "firebase/auth"
import { getStorage } from "firebase/storage"
import { getFunctions } from "firebase/functions"

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBkS-3UO1ayGs0-tZiUjxBT8TVkEGnhp0E",
  authDomain: "x1sports.firebaseapp.com",
  projectId: "x1sports",
  storageBucket: "x1sports.firebasestorage.app",
  messagingSenderId: "167396231340",
  appId: "1:167396231340:web:7eb5513b6c1118aaddb709",
}

// Initialize Firebase with error handling
let app
let db
let auth
let storage
let functions

try {
  app = initializeApp(firebaseConfig)

  // Initialize Firebase services
  db = getFirestore(app)
  auth = getAuth(app)
  storage = getStorage(app)
  functions = getFunctions(app)

  // Use emulators in development if needed
  if (process.env.NODE_ENV === "development") {
    // Uncomment these lines if you're using Firebase emulators
    // connectFirestoreEmulator(db, 'localhost', 8080);
    // connectAuthEmulator(auth, 'http://localhost:9099');
    // connectStorageEmulator(storage, 'localhost', 9199);
    // connectFunctionsEmulator(functions, 'localhost', 5001);
    console.log("Firebase initialized in development mode")
  } else {
    console.log("Firebase initialized in production mode")
  }
} catch (error) {
  console.error("Firebase initialization error:", error)

  // Provide fallback implementations if Firebase fails to initialize
  if (typeof window !== "undefined") {
    console.warn("Using localStorage fallback for data storage")
  }
}

export { db, auth, storage, functions }
export default app
