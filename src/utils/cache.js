import { STORAGE_KEYS, CACHE_DURATION } from './constants'

// In-memory cache for faster access
const memoryCache = new Map()

/**
 * Cache item structure
 * @typedef {Object} CacheItem
 * @property {any} data - Cached data
 * @property {number} timestamp - Cache timestamp
 * @property {number} ttl - Time to live in milliseconds
 */

/**
 * Generate cache key with prefix
 * @param {string} key - Cache key
 * @returns {string} Prefixed cache key
 */
const getCacheKey = (key) => `${STORAGE_KEYS.CACHE}_${key}`

/**
 * Check if cache item is expired
 * @param {CacheItem} item - Cache item
 * @returns {boolean} True if expired
 */
const isExpired = (item) => {
  if (!item || !item.timestamp || !item.ttl) return true
  return Date.now() - item.timestamp > item.ttl
}

/**
 * Set item in cache (both memory and localStorage)
 * @param {string} key - Cache key
 * @param {any} data - Data to cache
 * @param {number} ttl - Time to live in milliseconds
 */
export const cacheSet = (key, data, ttl = CACHE_DURATION.MEDIUM) => {
  const cacheItem = {
    data,
    timestamp: Date.now(),
    ttl,
  }
  
  // Store in memory cache
  memoryCache.set(key, cacheItem)
  
  // Store in localStorage (with error handling)
  try {
    const cacheKey = getCacheKey(key)
    localStorage.setItem(cacheKey, JSON.stringify(cacheItem))
  } catch (error) {
    console.warn('Failed to store in localStorage:', error.message)
    // If localStorage is full, try to clear old items
    clearExpiredCache()
  }
}

/**
 * Get item from cache (check memory first, then localStorage)
 * @param {string} key - Cache key
 * @returns {any|null} Cached data or null if not found/expired
 */
export const cacheGet = (key) => {
  // Check memory cache first
  const memoryItem = memoryCache.get(key)
  if (memoryItem && !isExpired(memoryItem)) {
    return memoryItem.data
  }
  
  // Remove expired item from memory
  if (memoryItem && isExpired(memoryItem)) {
    memoryCache.delete(key)
  }
  
  // Check localStorage
  try {
    const cacheKey = getCacheKey(key)
    const stored = localStorage.getItem(cacheKey)
    
    if (!stored) return null
    
    const cacheItem = JSON.parse(stored)
    
    if (isExpired(cacheItem)) {
      localStorage.removeItem(cacheKey)
      return null
    }
    
    // Store back in memory cache for faster future access
    memoryCache.set(key, cacheItem)
    
    return cacheItem.data
  } catch (error) {
    console.warn('Failed to read from localStorage:', error.message)
    return null
  }
}

/**
 * Remove item from cache
 * @param {string} key - Cache key
 */
export const cacheRemove = (key) => {
  // Remove from memory cache
  memoryCache.delete(key)
  
  // Remove from localStorage
  try {
    const cacheKey = getCacheKey(key)
    localStorage.removeItem(cacheKey)
  } catch (error) {
    console.warn('Failed to remove from localStorage:', error.message)
  }
}

/**
 * Clear all cache items
 */
export const cacheClear = () => {
  // Clear memory cache
  memoryCache.clear()
  
  // Clear localStorage cache items
  try {
    const keys = Object.keys(localStorage)
    const cacheKeys = keys.filter(key => key.startsWith(STORAGE_KEYS.CACHE))
    
    cacheKeys.forEach(key => {
      localStorage.removeItem(key)
    })
  } catch (error) {
    console.warn('Failed to clear localStorage cache:', error.message)
  }
}

/**
 * Clear expired cache items
 */
export const clearExpiredCache = () => {
  // Clear expired items from memory cache
  for (const [key, item] of memoryCache.entries()) {
    if (isExpired(item)) {
      memoryCache.delete(key)
    }
  }
  
  // Clear expired items from localStorage
  try {
    const keys = Object.keys(localStorage)
    const cacheKeys = keys.filter(key => key.startsWith(STORAGE_KEYS.CACHE))
    
    cacheKeys.forEach(key => {
      try {
        const stored = localStorage.getItem(key)
        if (stored) {
          const cacheItem = JSON.parse(stored)
          if (isExpired(cacheItem)) {
            localStorage.removeItem(key)
          }
        }
      } catch (error) {
        // Remove corrupted cache items
        localStorage.removeItem(key)
      }
    })
  } catch (error) {
    console.warn('Failed to clear expired localStorage cache:', error.message)
  }
}

/**
 * Get cache statistics
 * @returns {Object} Cache statistics
 */
export const getCacheStats = () => {
  const memorySize = memoryCache.size
  
  let localStorageSize = 0
  let localStorageItems = 0
  
  try {
    const keys = Object.keys(localStorage)
    const cacheKeys = keys.filter(key => key.startsWith(STORAGE_KEYS.CACHE))
    localStorageItems = cacheKeys.length
    
    // Calculate approximate size
    cacheKeys.forEach(key => {
      const value = localStorage.getItem(key)
      if (value) {
        localStorageSize += value.length
      }
    })
  } catch (error) {
    console.warn('Failed to get localStorage stats:', error.message)
  }
  
  return {
    memory: {
      items: memorySize,
    },
    localStorage: {
      items: localStorageItems,
      sizeBytes: localStorageSize,
      sizeKB: Math.round(localStorageSize / 1024),
    },
  }
}

/**
 * Initialize cache (clear expired items on startup)
 */
export const initCache = () => {
  clearExpiredCache()
  
  // Set up periodic cleanup (every 5 minutes)
  setInterval(clearExpiredCache, 5 * 60 * 1000)
}

// Auto-initialize cache
if (typeof window !== 'undefined') {
  initCache()
}

// Export cache utilities
const cacheUtils = {
  set: cacheSet,
  get: cacheGet,
  remove: cacheRemove,
  clear: cacheClear,
  clearExpired: clearExpiredCache,
  getStats: getCacheStats,
  init: initCache,
}

export default cacheUtils
