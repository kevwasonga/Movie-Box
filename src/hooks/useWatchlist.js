import { useState, useEffect, useCallback } from 'react'
import watchlistService from '../services/watchlistService'

/**
 * Custom hook for managing watchlist functionality
 * @returns {object} Hook state and methods
 */
export const useWatchlist = () => {
  const [watchlist, setWatchlist] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  // Load watchlist on mount
  useEffect(() => {
    loadWatchlist()
  }, [])

  const loadWatchlist = useCallback(() => {
    try {
      const data = watchlistService.get()
      setWatchlist(data)
    } catch (err) {
      console.error('Error loading watchlist:', err)
      setError(err.message)
    }
  }, [])

  const addToWatchlist = useCallback(async (item) => {
    try {
      setLoading(true)
      setError(null)
      
      const updatedWatchlist = watchlistService.add(item)
      setWatchlist(updatedWatchlist)
      
      return { success: true, message: 'Added to watchlist!' }
    } catch (err) {
      console.error('Error adding to watchlist:', err)
      setError(err.message)
      return { success: false, message: err.message }
    } finally {
      setLoading(false)
    }
  }, [])

  const removeFromWatchlist = useCallback(async (id, mediaType = 'movie') => {
    try {
      setLoading(true)
      setError(null)
      
      const updatedWatchlist = watchlistService.remove(id, mediaType)
      setWatchlist(updatedWatchlist)
      
      return { success: true, message: 'Removed from watchlist!' }
    } catch (err) {
      console.error('Error removing from watchlist:', err)
      setError(err.message)
      return { success: false, message: err.message }
    } finally {
      setLoading(false)
    }
  }, [])

  const toggleWatchlist = useCallback(async (item) => {
    try {
      setLoading(true)
      setError(null)
      
      const result = watchlistService.toggle(item)
      setWatchlist(result.watchlist)
      
      return { 
        success: true, 
        action: result.action,
        message: result.message 
      }
    } catch (err) {
      console.error('Error toggling watchlist:', err)
      setError(err.message)
      return { success: false, message: err.message }
    } finally {
      setLoading(false)
    }
  }, [])

  const clearWatchlist = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      
      watchlistService.clear()
      setWatchlist([])
      
      return { success: true, message: 'Watchlist cleared!' }
    } catch (err) {
      console.error('Error clearing watchlist:', err)
      setError(err.message)
      return { success: false, message: err.message }
    } finally {
      setLoading(false)
    }
  }, [])

  const isInWatchlist = useCallback((id, mediaType = 'movie') => {
    return watchlistService.isInWatchlist(id, mediaType)
  }, [])

  const exportWatchlist = useCallback(async (filename) => {
    try {
      setLoading(true)
      setError(null)
      
      watchlistService.export(filename)
      
      return { success: true, message: 'Watchlist exported successfully!' }
    } catch (err) {
      console.error('Error exporting watchlist:', err)
      setError(err.message)
      return { success: false, message: err.message }
    } finally {
      setLoading(false)
    }
  }, [])

  const getWatchlistStats = useCallback(() => {
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
  }, [watchlist])

  const filterWatchlist = useCallback((filters = {}) => {
    let filtered = [...watchlist]

    // Filter by media type
    if (filters.mediaType && filters.mediaType !== 'all') {
      filtered = filtered.filter(item => item.media_type === filters.mediaType)
    }

    // Filter by search query
    if (filters.query) {
      const query = filters.query.toLowerCase()
      filtered = filtered.filter(item =>
        item.title.toLowerCase().includes(query) ||
        (item.overview && item.overview.toLowerCase().includes(query))
      )
    }

    // Filter by year
    if (filters.year) {
      filtered = filtered.filter(item => {
        const itemYear = new Date(item.release_date || '').getFullYear()
        return itemYear.toString() === filters.year
      })
    }

    // Filter by rating range
    if (filters.minRating !== undefined) {
      filtered = filtered.filter(item => (item.vote_average || 0) >= filters.minRating)
    }

    if (filters.maxRating !== undefined) {
      filtered = filtered.filter(item => (item.vote_average || 0) <= filters.maxRating)
    }

    // Sort
    if (filters.sortBy) {
      filtered.sort((a, b) => {
        switch (filters.sortBy) {
          case 'title':
            return a.title.localeCompare(b.title)
          case 'title_desc':
            return b.title.localeCompare(a.title)
          case 'release_date':
            return new Date(b.release_date || 0) - new Date(a.release_date || 0)
          case 'release_date_asc':
            return new Date(a.release_date || 0) - new Date(b.release_date || 0)
          case 'rating':
            return (b.vote_average || 0) - (a.vote_average || 0)
          case 'rating_asc':
            return (a.vote_average || 0) - (b.vote_average || 0)
          case 'added_at':
          default:
            return (b.added_at || 0) - (a.added_at || 0)
        }
      })
    }

    return filtered
  }, [watchlist])

  return {
    watchlist,
    loading,
    error,
    addToWatchlist,
    removeFromWatchlist,
    toggleWatchlist,
    clearWatchlist,
    isInWatchlist,
    exportWatchlist,
    getWatchlistStats,
    filterWatchlist,
    loadWatchlist
  }
}

export default useWatchlist
