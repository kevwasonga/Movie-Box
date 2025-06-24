import axios from 'axios'
import { OMDB_API_KEY, OMDB_BASE_URL, CACHE_DURATION } from '../utils/constants'
import { cacheGet, cacheSet } from '../utils/cache'

// Create axios instance with default config
const omdbApi = axios.create({
  baseURL: OMDB_BASE_URL,
  params: {
    apikey: OMDB_API_KEY,
  },
  timeout: 10000,
})

// Request interceptor for logging
omdbApi.interceptors.request.use(
  (config) => {
    console.log(`OMDB API Request: ${config.method?.toUpperCase()} ${config.url}`)
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor for error handling
omdbApi.interceptors.response.use(
  (response) => {
    // OMDB returns errors in the response body
    if (response.data.Response === 'False') {
      throw new Error(response.data.Error || 'OMDB API error')
    }
    return response
  },
  (error) => {
    console.error('OMDB API Error:', error.response?.data || error.message)
    
    if (error.response?.status === 401) {
      throw new Error('Invalid OMDB API key. Please check your configuration.')
    }
    
    if (error.response?.status >= 500) {
      throw new Error('OMDB server error. Please try again later.')
    }
    
    throw new Error(error.response?.data?.Error || 'Network error occurred.')
  }
)

/**
 * Generic OMDB API call with caching
 * @param {object} params - Query parameters
 * @param {number} cacheDuration - Cache duration in milliseconds
 * @returns {Promise<object>} API response data
 */
const apiCall = async (params = {}, cacheDuration = CACHE_DURATION.LONG) => {
  const cacheKey = `omdb_${JSON.stringify(params)}`
  
  // Try to get from cache first
  const cachedData = cacheGet(cacheKey)
  if (cachedData) {
    return cachedData
  }
  
  try {
    const response = await omdbApi.get('/', { params })
    const data = response.data
    
    // Cache the response
    cacheSet(cacheKey, data, cacheDuration)
    
    return data
  } catch (error) {
    throw error
  }
}

/**
 * Get movie/TV show details by IMDB ID
 * @param {string} imdbId - IMDB ID (e.g., 'tt1234567')
 * @param {string} plot - Plot length ('short' or 'full')
 * @returns {Promise<object>} Movie/TV show details
 */
export const getByImdbId = async (imdbId, plot = 'short') => {
  if (!imdbId) {
    throw new Error('IMDB ID is required')
  }
  
  return apiCall({
    i: imdbId,
    plot,
  })
}

/**
 * Get movie/TV show details by title
 * @param {string} title - Movie/TV show title
 * @param {string} year - Release year (optional)
 * @param {string} type - Type ('movie', 'series', or 'episode')
 * @param {string} plot - Plot length ('short' or 'full')
 * @returns {Promise<object>} Movie/TV show details
 */
export const getByTitle = async (title, year = null, type = null, plot = 'short') => {
  if (!title) {
    throw new Error('Title is required')
  }
  
  const params = {
    t: title,
    plot,
  }
  
  if (year) params.y = year
  if (type) params.type = type
  
  return apiCall(params)
}

/**
 * Search for movies/TV shows
 * @param {string} query - Search query
 * @param {string} type - Type ('movie', 'series', or 'episode')
 * @param {number} page - Page number
 * @param {string} year - Release year (optional)
 * @returns {Promise<object>} Search results
 */
export const search = async (query, type = null, page = 1, year = null) => {
  if (!query) {
    throw new Error('Search query is required')
  }
  
  const params = {
    s: query,
    page,
  }
  
  if (type) params.type = type
  if (year) params.y = year
  
  return apiCall(params, CACHE_DURATION.SHORT)
}

/**
 * Get additional ratings and details for a movie/TV show
 * This is useful to supplement TMDB data with IMDB ratings, Rotten Tomatoes, etc.
 * @param {string} imdbId - IMDB ID from TMDB data
 * @returns {Promise<object|null>} Additional details or null if not found
 */
export const getAdditionalDetails = async (imdbId) => {
  if (!imdbId) {
    return null
  }
  
  try {
    const data = await getByImdbId(imdbId, 'short')
    
    // Extract useful additional information
    return {
      imdbRating: data.imdbRating !== 'N/A' ? parseFloat(data.imdbRating) : null,
      imdbVotes: data.imdbVotes !== 'N/A' ? data.imdbVotes : null,
      rottenTomatoesRating: extractRottenTomatoesRating(data.Ratings),
      metacriticRating: data.Metascore !== 'N/A' ? parseInt(data.Metascore) : null,
      awards: data.Awards !== 'N/A' ? data.Awards : null,
      boxOffice: data.BoxOffice !== 'N/A' ? data.BoxOffice : null,
      production: data.Production !== 'N/A' ? data.Production : null,
      website: data.Website !== 'N/A' ? data.Website : null,
      plot: data.Plot !== 'N/A' ? data.Plot : null,
      rated: data.Rated !== 'N/A' ? data.Rated : null,
      dvd: data.DVD !== 'N/A' ? data.DVD : null,
    }
  } catch (error) {
    console.warn('Failed to get additional details from OMDB:', error.message)
    return null
  }
}

/**
 * Extract Rotten Tomatoes rating from ratings array
 * @param {Array} ratings - Ratings array from OMDB
 * @returns {number|null} Rotten Tomatoes rating percentage
 */
const extractRottenTomatoesRating = (ratings) => {
  if (!ratings || !Array.isArray(ratings)) return null
  
  const rtRating = ratings.find(rating => rating.Source === 'Rotten Tomatoes')
  if (!rtRating) return null
  
  const match = rtRating.Value.match(/(\d+)%/)
  return match ? parseInt(match[1]) : null
}

/**
 * Check if OMDB API is available and configured
 * @returns {boolean} True if API is available
 */
export const isAvailable = () => {
  return OMDB_API_KEY && OMDB_API_KEY !== 'demo_key'
}

// Export default API object
const omdbApiService = {
  getByImdbId,
  getByTitle,
  search,
  getAdditionalDetails,
  isAvailable,
}

export default omdbApiService
