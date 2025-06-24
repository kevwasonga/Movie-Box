import { STORAGE_KEYS } from '../utils/constants'
import { downloadJSON } from '../utils/helpers'

/**
 * Watchlist item structure
 * @typedef {Object} WatchlistItem
 * @property {number} id - TMDB ID
 * @property {string} title - Movie title or TV show name
 * @property {string} media_type - 'movie' or 'tv'
 * @property {string} poster_path - Poster image path
 * @property {string} release_date - Release date or first air date
 * @property {number} vote_average - Rating
 * @property {string} overview - Plot overview
 * @property {number} added_at - Timestamp when added to watchlist
 */

/**
 * Get watchlist from localStorage
 * @returns {WatchlistItem[]} Array of watchlist items
 */
export const getWatchlist = () => {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.WATCHLIST)
    if (!stored) return []
    
    const watchlist = JSON.parse(stored)
    
    // Ensure it's an array and has valid structure
    if (!Array.isArray(watchlist)) return []
    
    // Sort by added_at timestamp (newest first)
    return watchlist.sort((a, b) => (b.added_at || 0) - (a.added_at || 0))
  } catch (error) {
    console.error('Failed to get watchlist:', error)
    return []
  }
}

/**
 * Save watchlist to localStorage
 * @param {WatchlistItem[]} watchlist - Watchlist array
 */
const saveWatchlist = (watchlist) => {
  try {
    localStorage.setItem(STORAGE_KEYS.WATCHLIST, JSON.stringify(watchlist))
  } catch (error) {
    console.error('Failed to save watchlist:', error)
    throw new Error('Failed to save watchlist. Storage might be full.')
  }
}

/**
 * Add item to watchlist
 * @param {Object} item - Movie or TV show data from TMDB
 * @returns {WatchlistItem[]} Updated watchlist
 */
export const addToWatchlist = (item) => {
  if (!item || !item.id) {
    throw new Error('Invalid item data')
  }
  
  const watchlist = getWatchlist()
  
  // Check if item already exists
  const exists = watchlist.some(
    watchlistItem => 
      watchlistItem.id === item.id && 
      watchlistItem.media_type === (item.media_type || 'movie')
  )
  
  if (exists) {
    throw new Error('Item already in watchlist')
  }
  
  // Create watchlist item
  const watchlistItem = {
    id: item.id,
    title: item.title || item.name,
    media_type: item.media_type || 'movie',
    poster_path: item.poster_path,
    release_date: item.release_date || item.first_air_date,
    vote_average: item.vote_average,
    overview: item.overview,
    added_at: Date.now(),
  }
  
  // Add to beginning of array
  const updatedWatchlist = [watchlistItem, ...watchlist]
  
  saveWatchlist(updatedWatchlist)
  return updatedWatchlist
}

/**
 * Remove item from watchlist
 * @param {number} id - Item ID
 * @param {string} mediaType - Media type ('movie' or 'tv')
 * @returns {WatchlistItem[]} Updated watchlist
 */
export const removeFromWatchlist = (id, mediaType = 'movie') => {
  if (!id) {
    throw new Error('Item ID is required')
  }
  
  const watchlist = getWatchlist()
  
  const updatedWatchlist = watchlist.filter(
    item => !(item.id === id && item.media_type === mediaType)
  )
  
  if (updatedWatchlist.length === watchlist.length) {
    throw new Error('Item not found in watchlist')
  }
  
  saveWatchlist(updatedWatchlist)
  return updatedWatchlist
}

/**
 * Check if item is in watchlist
 * @param {number} id - Item ID
 * @param {string} mediaType - Media type ('movie' or 'tv')
 * @returns {boolean} True if item is in watchlist
 */
export const isInWatchlist = (id, mediaType = 'movie') => {
  if (!id) return false
  
  const watchlist = getWatchlist()
  return watchlist.some(
    item => item.id === id && item.media_type === mediaType
  )
}

/**
 * Toggle item in watchlist (add if not present, remove if present)
 * @param {Object} item - Movie or TV show data from TMDB
 * @returns {Object} Result object with action and updated watchlist
 */
export const toggleWatchlist = (item) => {
  if (!item || !item.id) {
    throw new Error('Invalid item data')
  }
  
  const mediaType = item.media_type || 'movie'
  
  if (isInWatchlist(item.id, mediaType)) {
    const updatedWatchlist = removeFromWatchlist(item.id, mediaType)
    return {
      action: 'removed',
      watchlist: updatedWatchlist,
      message: 'Removed from watchlist',
    }
  } else {
    const updatedWatchlist = addToWatchlist(item)
    return {
      action: 'added',
      watchlist: updatedWatchlist,
      message: 'Added to watchlist',
    }
  }
}

/**
 * Clear entire watchlist
 * @returns {WatchlistItem[]} Empty watchlist
 */
export const clearWatchlist = () => {
  try {
    localStorage.removeItem(STORAGE_KEYS.WATCHLIST)
    return []
  } catch (error) {
    console.error('Failed to clear watchlist:', error)
    throw new Error('Failed to clear watchlist')
  }
}

/**
 * Get watchlist statistics
 * @returns {Object} Watchlist statistics
 */
export const getWatchlistStats = () => {
  const watchlist = getWatchlist()
  
  const stats = {
    total: watchlist.length,
    movies: watchlist.filter(item => item.media_type === 'movie').length,
    tvShows: watchlist.filter(item => item.media_type === 'tv').length,
    averageRating: 0,
    oldestItem: null,
    newestItem: null,
  }
  
  if (watchlist.length > 0) {
    // Calculate average rating
    const ratingsSum = watchlist.reduce((sum, item) => sum + (item.vote_average || 0), 0)
    stats.averageRating = (ratingsSum / watchlist.length).toFixed(1)
    
    // Find oldest and newest items
    const sortedByDate = [...watchlist].sort((a, b) => (a.added_at || 0) - (b.added_at || 0))
    stats.oldestItem = sortedByDate[0]
    stats.newestItem = sortedByDate[sortedByDate.length - 1]
  }
  
  return stats
}

/**
 * Export watchlist as JSON file
 * @param {string} filename - Optional filename
 */
export const exportWatchlist = (filename = 'movie-box-watchlist.json') => {
  const watchlist = getWatchlist()
  
  if (watchlist.length === 0) {
    throw new Error('Watchlist is empty')
  }
  
  const exportData = {
    exported_at: new Date().toISOString(),
    app: 'Movie Box',
    version: '1.0.0',
    total_items: watchlist.length,
    watchlist,
  }
  
  downloadJSON(exportData, filename)
}

/**
 * Import watchlist from JSON data
 * @param {Object} data - Imported JSON data
 * @param {boolean} merge - Whether to merge with existing watchlist
 * @returns {WatchlistItem[]} Updated watchlist
 */
export const importWatchlist = (data, merge = false) => {
  if (!data || !data.watchlist || !Array.isArray(data.watchlist)) {
    throw new Error('Invalid import data format')
  }
  
  const currentWatchlist = merge ? getWatchlist() : []
  const importedItems = data.watchlist
  
  // Validate and filter imported items
  const validItems = importedItems.filter(item => {
    return item && 
           typeof item.id === 'number' && 
           typeof item.title === 'string' && 
           ['movie', 'tv'].includes(item.media_type)
  })
  
  if (validItems.length === 0) {
    throw new Error('No valid items found in import data')
  }
  
  // Merge with current watchlist, avoiding duplicates
  const mergedWatchlist = [...currentWatchlist]
  
  validItems.forEach(importedItem => {
    const exists = mergedWatchlist.some(
      existing => 
        existing.id === importedItem.id && 
        existing.media_type === importedItem.media_type
    )
    
    if (!exists) {
      // Add timestamp if not present
      if (!importedItem.added_at) {
        importedItem.added_at = Date.now()
      }
      mergedWatchlist.push(importedItem)
    }
  })
  
  // Sort by added_at timestamp (newest first)
  const sortedWatchlist = mergedWatchlist.sort((a, b) => (b.added_at || 0) - (a.added_at || 0))
  
  saveWatchlist(sortedWatchlist)
  return sortedWatchlist
}

// Export watchlist service
const watchlistService = {
  get: getWatchlist,
  add: addToWatchlist,
  remove: removeFromWatchlist,
  isInWatchlist,
  toggle: toggleWatchlist,
  clear: clearWatchlist,
  getStats: getWatchlistStats,
  export: exportWatchlist,
  import: importWatchlist,
}

export default watchlistService
