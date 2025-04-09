import { type NextRequest, NextResponse } from "next/server"
import { adminAuth, adminDb } from "@/lib/firebase-admin"

export async function POST(request: NextRequest) {
  try {
    // Get the user ID to delete from the request
    const { userId } = await request.json()

    if (!userId) {
      return NextResponse.json({ success: false, message: "User ID is required" }, { status: 400 })
    }

    console.log(`Starting deletion process for user ID: ${userId}`)

    try {
      // Delete the user from Firebase Authentication
      await adminAuth.deleteUser(userId)
      console.log(`Successfully deleted user ${userId} from Firebase Authentication`)
    } catch (authError: any) {
      console.error(`Error deleting user from Authentication: ${authError.message}`)
      return NextResponse.json(
        {
          success: false,
          message: `Failed to delete user from Authentication: ${authError.message}`,
          error: authError.code,
        },
        { status: 500 },
      )
    }

    try {
      // Delete the user document from Firestore
      await adminDb.collection("users").doc(userId).delete()
      console.log(`Successfully deleted user ${userId} from Firestore database`)
    } catch (dbError: any) {
      console.error(`Error deleting user from Firestore: ${dbError.message}`)
      return NextResponse.json(
        {
          success: false,
          message: `User was deleted from Authentication but failed to delete from database: ${dbError.message}`,
          error: dbError.code,
        },
        { status: 500 },
      )
    }

    // Delete any related data (products, orders, etc.)
    try {
      // Example: Delete user's products
      const productsSnapshot = await adminDb.collection("products").where("userId", "==", userId).get()

      if (!productsSnapshot.empty) {
        const batch = adminDb.batch()

        productsSnapshot.docs.forEach((doc) => {
          batch.delete(doc.ref)
        })

        await batch.commit()
        console.log(`Successfully deleted ${productsSnapshot.size} products associated with user ${userId}`)
      } else {
        console.log(`No products found for user ${userId}`)
      }
    } catch (productsError: any) {
      console.error(`Error deleting user's products: ${productsError.message}`)
      // We don't return an error here since the user was already deleted
    }

    return NextResponse.json({
      success: true,
      message: "User deleted successfully from both Authentication and Database",
    })
  } catch (error: any) {
    console.error("Error in delete user API:", error)

    return NextResponse.json(
      {
        success: false,
        message: error.message || "Failed to delete user",
        error: error.code,
      },
      { status: 500 },
    )
  }
}
