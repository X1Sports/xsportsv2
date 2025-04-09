/**
 * Validates if a URL is properly formatted and accessible
 * @param url The URL to validate
 * @returns Promise that resolves to true if valid, false otherwise
 */
export const isValidImageUrl = async (url: string): Promise<boolean> => {
  if (!url) return false

  // Basic URL validation
  try {
    new URL(url)
  } catch (e) {
    console.error("Invalid URL format:", url)
    return false
  }

  // Check if the image is accessible
  try {
    const response = await fetch(url, { method: "HEAD" })
    return response.ok && response.headers.get("Content-Type")?.startsWith("image/")
  } catch (error) {
    console.error("Error validating image URL:", error)
    return false
  }
}

/**
 * Gets a profile image URL with fallback logic
 * @param user The user object from Firebase Auth
 * @param profileData The profile data from Firestore
 * @returns The best available profile image URL or null
 */
export const getProfileImageUrl = (user: any, profileData: any): string | null => {
  // Try Firebase Auth photoURL first
  if (user?.photoURL) {
    return user.photoURL
  }

  // Then try profile data
  if (profileData?.photoURL) {
    return profileData.photoURL
  }

  // Finally try profile picture from profile data
  if (profileData?.profilePicture) {
    return profileData.profilePicture
  }

  // No valid image found
  return null
}
