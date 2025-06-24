import axios from 'axios'
import { TMDB_API_KEY, TMDB_BASE_URL, CACHE_DURATION } from '../utils/constants'
import { cacheGet, cacheSet } from '../utils/cache'

// Create axios instance with default config
const tmdbApi = axios.create({
  baseURL: TMDB_BASE_URL,
  params: {
    api_key: TMDB_API_KEY,
  },
  timeout: 10000,
})

// Request interceptor for logging
tmdbApi.interceptors.request.use(
  (config) => {
    console.log(`TMDB API Request: ${config.method?.toUpperCase()} ${config.url}`)
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor for error handling
tmdbApi.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    console.error('TMDB API Error:', error.response?.data || error.message)
    
    if (error.response?.status === 429) {
      throw new Error('API rate limit exceeded. Please try again later.')
    }
    
    if (error.response?.status === 401) {
      throw new Error('Invalid API key. Please check your configuration.')
    }
    
    if (error.response?.status >= 500) {
      throw new Error('Server error. Please try again later.')
    }
    
    throw new Error(error.response?.data?.status_message || 'Network error occurred.')
  }
)

/**
 * Generic API call with caching
 * @param {string} endpoint - API endpoint
 * @param {object} params - Query parameters
 * @param {number} cacheDuration - Cache duration in milliseconds
 * @returns {Promise<object>} API response data
 */
const apiCall = async (endpoint, params = {}, cacheDuration = CACHE_DURATION.MEDIUM) => {
  const cacheKey = `tmdb_${endpoint}_${JSON.stringify(params)}`
  
  // Try to get from cache first
  const cachedData = cacheGet(cacheKey)
  if (cachedData) {
    return cachedData
  }
  
  try {
    const response = await tmdbApi.get(endpoint, { params })
    const data = response.data
    
    // Cache the response
    cacheSet(cacheKey, data, cacheDuration)
    
    return data
  } catch (error) {
    throw error
  }
}

// Movie API endpoints
export const movieApi = {
  // Get trending movies
  getTrending: (timeWindow = 'week') => 
    apiCall(`/trending/movie/${timeWindow}`),
  
  // Get popular movies
  getPopular: (page = 1) => 
    apiCall('/movie/popular', { page }),
  
  // Get top rated movies
  getTopRated: (page = 1) => 
    apiCall('/movie/top_rated', { page }),
  
  // Get now playing movies
  getNowPlaying: (page = 1) => 
    apiCall('/movie/now_playing', { page }),
  
  // Get upcoming movies
  getUpcoming: (page = 1) => 
    apiCall('/movie/upcoming', { page }),
  
  // Get movie details
  getDetails: (movieId) => 
    apiCall(`/movie/${movieId}`, { append_to_response: 'credits,videos,similar,reviews' }),
  
  // Search movies
  search: (query, page = 1) => 
    apiCall('/search/movie', { query, page }, CACHE_DURATION.SHORT),
  
  // Discover movies with filters
  discover: (filters = {}) => 
    apiCall('/discover/movie', filters),
  
  // Get movie credits
  getCredits: (movieId) => 
    apiCall(`/movie/${movieId}/credits`),
  
  // Get similar movies
  getSimilar: (movieId, page = 1) => 
    apiCall(`/movie/${movieId}/similar`, { page }),
  
  // Get movie reviews
  getReviews: (movieId, page = 1) => 
    apiCall(`/movie/${movieId}/reviews`, { page }),
  
  // Get movie videos
  getVideos: (movieId) => 
    apiCall(`/movie/${movieId}/videos`),
}

// TV Show API endpoints
export const tvApi = {
  // Get trending TV shows
  getTrending: (timeWindow = 'week') => 
    apiCall(`/trending/tv/${timeWindow}`),
  
  // Get popular TV shows
  getPopular: (page = 1) => 
    apiCall('/tv/popular', { page }),
  
  // Get top rated TV shows
  getTopRated: (page = 1) => 
    apiCall('/tv/top_rated', { page }),
  
  // Get airing today
  getAiringToday: (page = 1) => 
    apiCall('/tv/airing_today', { page }),
  
  // Get on the air
  getOnTheAir: (page = 1) => 
    apiCall('/tv/on_the_air', { page }),
  
  // Get TV show details
  getDetails: (tvId) => 
    apiCall(`/tv/${tvId}`, { append_to_response: 'credits,videos,similar,reviews' }),
  
  // Search TV shows
  search: (query, page = 1) => 
    apiCall('/search/tv', { query, page }, CACHE_DURATION.SHORT),
  
  // Discover TV shows with filters
  discover: (filters = {}) => 
    apiCall('/discover/tv', filters),
  
  // Get TV show credits
  getCredits: (tvId) => 
    apiCall(`/tv/${tvId}/credits`),
  
  // Get similar TV shows
  getSimilar: (tvId, page = 1) => 
    apiCall(`/tv/${tvId}/similar`, { page }),
  
  // Get TV show reviews
  getReviews: (tvId, page = 1) => 
    apiCall(`/tv/${tvId}/reviews`, { page }),
  
  // Get TV show videos
  getVideos: (tvId) => 
    apiCall(`/tv/${tvId}/videos`),
}

// General API endpoints
export const generalApi = {
  // Multi search (movies, TV shows, people)
  multiSearch: (query, page = 1) => 
    apiCall('/search/multi', { query, page }, CACHE_DURATION.SHORT),
  
  // Get genres for movies
  getMovieGenres: () => 
    apiCall('/genre/movie/list', {}, CACHE_DURATION.LONG),
  
  // Get genres for TV shows
  getTvGenres: () => 
    apiCall('/genre/tv/list', {}, CACHE_DURATION.LONG),
  
  // Get configuration
  getConfiguration: () => 
    apiCall('/configuration', {}, CACHE_DURATION.LONG),
  
  // Get trending all (movies, TV shows, people)
  getTrendingAll: (timeWindow = 'week') => 
    apiCall(`/trending/all/${timeWindow}`),
}

// Person API endpoints
export const personApi = {
  // Get person details
  getDetails: (personId) => 
    apiCall(`/person/${personId}`, { append_to_response: 'movie_credits,tv_credits' }),
  
  // Search people
  search: (query, page = 1) => 
    apiCall('/search/person', { query, page }, CACHE_DURATION.SHORT),
  
  // Get popular people
  getPopular: (page = 1) => 
    apiCall('/person/popular', { page }),
}

// Export default API object
const tmdbApiService = {
  movie: movieApi,
  tv: tvApi,
  general: generalApi,
  person: personApi,
}

export default tmdbApiService
