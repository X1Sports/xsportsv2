// Utility functions for localStorage fallback

// Type-safe localStorage get
export function getFromStorage<T>(key: string, defaultValue: T): T {
  if (typeof window === "undefined") return defaultValue

  try {
    const item = localStorage.getItem(key)
    return item ? JSON.parse(item) : defaultValue
  } catch (error) {
    console.error(`Error getting ${key} from localStorage:`, error)
    return defaultValue
  }
}

// Type-safe localStorage set
export function setInStorage<T>(key: string, value: T): void {
  if (typeof window === "undefined") return

  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch (error) {
    console.error(`Error setting ${key} in localStorage:`, error)
  }
}

// Remove item from localStorage
export function removeFromStorage(key: string): void {
  if (typeof window === "undefined") return

  try {
    localStorage.removeItem(key)
  } catch (error) {
    console.error(`Error removing ${key} from localStorage:`, error)
  }
}

// Clear all app-related items from localStorage
export function clearAppStorage(prefix = "x1sports_"): void {
  if (typeof window === "undefined") return

  try {
    Object.keys(localStorage)
      .filter((key) => key.startsWith(prefix))
      .forEach((key) => localStorage.removeItem(key))
  } catch (error) {
    console.error("Error clearing app storage:", error)
  }
}
