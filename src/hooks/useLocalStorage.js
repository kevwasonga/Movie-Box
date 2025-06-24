import { useState, useEffect, useCallback } from 'react'

/**
 * Custom hook for managing localStorage with React state
 * @param {string} key - localStorage key
 * @param {any} initialValue - Initial value if key doesn't exist
 * @returns {[any, function, function]} [value, setValue, removeValue]
 */
export const useLocalStorage = (key, initialValue) => {
  // Get value from localStorage or use initial value
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key)
      return item ? JSON.parse(item) : initialValue
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error)
      return initialValue
    }
  })

  // Set value in both state and localStorage
  const setValue = useCallback((value) => {
    try {
      // Allow value to be a function so we have the same API as useState
      const valueToStore = value instanceof Function ? value(storedValue) : value
      setStoredValue(valueToStore)
      
      // Save to localStorage
      if (valueToStore === undefined) {
        window.localStorage.removeItem(key)
      } else {
        window.localStorage.setItem(key, JSON.stringify(valueToStore))
      }
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error)
    }
  }, [key, storedValue])

  // Remove value from both state and localStorage
  const removeValue = useCallback(() => {
    try {
      setStoredValue(initialValue)
      window.localStorage.removeItem(key)
    } catch (error) {
      console.error(`Error removing localStorage key "${key}":`, error)
    }
  }, [key, initialValue])

  // Listen for changes to localStorage from other tabs/windows
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === key && e.newValue !== null) {
        try {
          setStoredValue(JSON.parse(e.newValue))
        } catch (error) {
          console.error(`Error parsing localStorage value for key "${key}":`, error)
        }
      }
    }

    window.addEventListener('storage', handleStorageChange)
    return () => window.removeEventListener('storage', handleStorageChange)
  }, [key])

  return [storedValue, setValue, removeValue]
}

/**
 * Hook for managing theme preference in localStorage
 * @returns {[string, function]} [theme, setTheme]
 */
export const useTheme = () => {
  const [theme, setTheme] = useLocalStorage('theme', 'light')

  const toggleTheme = useCallback(() => {
    setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light')
  }, [setTheme])

  // Apply theme to document
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [theme])

  return [theme, setTheme, toggleTheme]
}

/**
 * Hook for managing search history in localStorage
 * @param {number} maxItems - Maximum number of search terms to keep
 * @returns {object} Search history state and methods
 */
export const useSearchHistory = (maxItems = 10) => {
  const [searchHistory, setSearchHistory] = useLocalStorage('searchHistory', [])

  const addToHistory = useCallback((searchTerm) => {
    if (!searchTerm || !searchTerm.trim()) return

    const term = searchTerm.trim()
    setSearchHistory(prevHistory => {
      // Remove existing occurrence if any
      const filtered = prevHistory.filter(item => item !== term)
      // Add to beginning and limit to maxItems
      return [term, ...filtered].slice(0, maxItems)
    })
  }, [setSearchHistory, maxItems])

  const removeFromHistory = useCallback((searchTerm) => {
    setSearchHistory(prevHistory => 
      prevHistory.filter(item => item !== searchTerm)
    )
  }, [setSearchHistory])

  const clearHistory = useCallback(() => {
    setSearchHistory([])
  }, [setSearchHistory])

  return {
    searchHistory,
    addToHistory,
    removeFromHistory,
    clearHistory
  }
}

/**
 * Hook for managing user preferences in localStorage
 * @returns {object} Preferences state and methods
 */
export const usePreferences = () => {
  const [preferences, setPreferences] = useLocalStorage('preferences', {
    language: 'en',
    region: 'US',
    adultContent: false,
    autoplay: false,
    notifications: true,
    defaultView: 'grid', // 'grid' or 'list'
    itemsPerPage: 20
  })

  const updatePreference = useCallback((key, value) => {
    setPreferences(prevPrefs => ({
      ...prevPrefs,
      [key]: value
    }))
  }, [setPreferences])

  const updatePreferences = useCallback((newPreferences) => {
    setPreferences(prevPrefs => ({
      ...prevPrefs,
      ...newPreferences
    }))
  }, [setPreferences])

  const resetPreferences = useCallback(() => {
    setPreferences({
      language: 'en',
      region: 'US',
      adultContent: false,
      autoplay: false,
      notifications: true,
      defaultView: 'grid',
      itemsPerPage: 20
    })
  }, [setPreferences])

  return {
    preferences,
    updatePreference,
    updatePreferences,
    resetPreferences
  }
}

/**
 * Hook for managing recently viewed items
 * @param {number} maxItems - Maximum number of items to keep
 * @returns {object} Recently viewed state and methods
 */
export const useRecentlyViewed = (maxItems = 20) => {
  const [recentlyViewed, setRecentlyViewed] = useLocalStorage('recentlyViewed', [])

  const addToRecentlyViewed = useCallback((item) => {
    if (!item || !item.id) return

    const viewedItem = {
      id: item.id,
      title: item.title || item.name,
      media_type: item.media_type || 'movie',
      poster_path: item.poster_path,
      vote_average: item.vote_average,
      viewed_at: Date.now()
    }

    setRecentlyViewed(prevViewed => {
      // Remove existing occurrence if any
      const filtered = prevViewed.filter(viewed => 
        !(viewed.id === item.id && viewed.media_type === viewedItem.media_type)
      )
      // Add to beginning and limit to maxItems
      return [viewedItem, ...filtered].slice(0, maxItems)
    })
  }, [setRecentlyViewed, maxItems])

  const removeFromRecentlyViewed = useCallback((id, mediaType) => {
    setRecentlyViewed(prevViewed => 
      prevViewed.filter(item => 
        !(item.id === id && item.media_type === mediaType)
      )
    )
  }, [setRecentlyViewed])

  const clearRecentlyViewed = useCallback(() => {
    setRecentlyViewed([])
  }, [setRecentlyViewed])

  return {
    recentlyViewed,
    addToRecentlyViewed,
    removeFromRecentlyViewed,
    clearRecentlyViewed
  }
}

export default useLocalStorage
