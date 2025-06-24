import { useState, useEffect, useCallback } from 'react'
import tmdbApi from '../services/tmdbApi'

/**
 * Custom hook for managing movie/TV show data
 * @param {string} type - 'movie' or 'tv'
 * @param {string} category - 'popular', 'trending', 'top_rated', etc.
 * @param {object} options - Additional options
 * @returns {object} Hook state and methods
 */
export const useMovies = (type = 'movie', category = 'popular', options = {}) => {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(0)
  const [totalResults, setTotalResults] = useState(0)
  const [hasMore, setHasMore] = useState(false)

  const { autoLoad = true, pageSize = 20 } = options

  const loadData = useCallback(async (page = 1, append = false) => {
    try {
      setLoading(true)
      setError(null)

      let response
      const api = type === 'movie' ? tmdbApi.movie : tmdbApi.tv

      switch (category) {
        case 'popular':
          response = await api.getPopular(page)
          break
        case 'trending':
          response = await (type === 'movie' ? tmdbApi.movie.getTrending() : tmdbApi.tv.getTrending())
          break
        case 'top_rated':
          response = await api.getTopRated(page)
          break
        case 'now_playing':
          response = type === 'movie' ? await api.getNowPlaying(page) : await api.getAiringToday(page)
          break
        case 'upcoming':
          response = type === 'movie' ? await api.getUpcoming(page) : await api.getOnTheAir(page)
          break
        default:
          throw new Error(`Unknown category: ${category}`)
      }

      const results = response.results || []
      const processedResults = results.map(item => ({
        ...item,
        media_type: type
      }))

      if (append && page > 1) {
        setData(prevData => [...prevData, ...processedResults])
      } else {
        setData(processedResults)
      }

      setCurrentPage(page)
      setTotalPages(response.total_pages || 0)
      setTotalResults(response.total_results || 0)
      setHasMore(page < (response.total_pages || 0))

    } catch (err) {
      console.error(`Error loading ${type} ${category}:`, err)
      setError(err.message)
      if (!append) {
        setData([])
      }
    } finally {
      setLoading(false)
    }
  }, [type, category])

  const loadMore = useCallback(() => {
    if (hasMore && !loading) {
      loadData(currentPage + 1, true)
    }
  }, [hasMore, loading, currentPage, loadData])

  const refresh = useCallback(() => {
    setCurrentPage(1)
    loadData(1, false)
  }, [loadData])

  const reset = useCallback(() => {
    setData([])
    setCurrentPage(1)
    setTotalPages(0)
    setTotalResults(0)
    setHasMore(false)
    setError(null)
  }, [])

  useEffect(() => {
    if (autoLoad) {
      loadData(1, false)
    }
  }, [loadData, autoLoad])

  return {
    data,
    loading,
    error,
    currentPage,
    totalPages,
    totalResults,
    hasMore,
    loadData,
    loadMore,
    refresh,
    reset
  }
}

/**
 * Hook for searching movies/TV shows
 * @param {object} options - Search options
 * @returns {object} Hook state and methods
 */
export const useMovieSearch = (options = {}) => {
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(0)
  const [totalResults, setTotalResults] = useState(0)
  const [hasMore, setHasMore] = useState(false)
  const [lastQuery, setLastQuery] = useState('')

  const { debounceMs = 500 } = options

  const search = useCallback(async (query, type = 'multi', page = 1, append = false) => {
    if (!query.trim()) {
      setResults([])
      setTotalPages(0)
      setTotalResults(0)
      setHasMore(false)
      return
    }

    try {
      setLoading(true)
      setError(null)
      setLastQuery(query)

      let response
      if (type === 'multi') {
        response = await tmdbApi.general.multiSearch(query, page)
      } else if (type === 'movie') {
        response = await tmdbApi.movie.search(query, page)
      } else if (type === 'tv') {
        response = await tmdbApi.tv.search(query, page)
      }

      const searchResults = response.results || []
      const processedResults = searchResults.map(item => ({
        ...item,
        media_type: item.media_type || type === 'multi' ? item.media_type : type
      }))

      if (append && page > 1) {
        setResults(prevResults => [...prevResults, ...processedResults])
      } else {
        setResults(processedResults)
      }

      setCurrentPage(page)
      setTotalPages(response.total_pages || 0)
      setTotalResults(response.total_results || 0)
      setHasMore(page < (response.total_pages || 0))

    } catch (err) {
      console.error('Search error:', err)
      setError(err.message)
      if (!append) {
        setResults([])
      }
    } finally {
      setLoading(false)
    }
  }, [])

  const loadMore = useCallback(() => {
    if (hasMore && !loading && lastQuery) {
      search(lastQuery, 'multi', currentPage + 1, true)
    }
  }, [hasMore, loading, lastQuery, currentPage, search])

  const clear = useCallback(() => {
    setResults([])
    setCurrentPage(1)
    setTotalPages(0)
    setTotalResults(0)
    setHasMore(false)
    setError(null)
    setLastQuery('')
  }, [])

  return {
    results,
    loading,
    error,
    currentPage,
    totalPages,
    totalResults,
    hasMore,
    lastQuery,
    search,
    loadMore,
    clear
  }
}

/**
 * Hook for getting movie/TV show details
 * @param {number} id - Movie/TV show ID
 * @param {string} type - 'movie' or 'tv'
 * @param {object} options - Additional options
 * @returns {object} Hook state and methods
 */
export const useMovieDetails = (id, type = 'movie', options = {}) => {
  const [details, setDetails] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const { autoLoad = true } = options

  const loadDetails = useCallback(async () => {
    if (!id) return

    try {
      setLoading(true)
      setError(null)

      const response = type === 'movie' 
        ? await tmdbApi.movie.getDetails(id)
        : await tmdbApi.tv.getDetails(id)

      setDetails({
        ...response,
        media_type: type
      })

    } catch (err) {
      console.error(`Error loading ${type} details:`, err)
      setError(err.message)
      setDetails(null)
    } finally {
      setLoading(false)
    }
  }, [id, type])

  const refresh = useCallback(() => {
    loadDetails()
  }, [loadDetails])

  const reset = useCallback(() => {
    setDetails(null)
    setError(null)
  }, [])

  useEffect(() => {
    if (autoLoad && id) {
      loadDetails()
    }
  }, [loadDetails, autoLoad, id])

  return {
    details,
    loading,
    error,
    loadDetails,
    refresh,
    reset
  }
}

export default useMovies
