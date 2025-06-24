// API Configuration
export const TMDB_API_KEY = import.meta.env.VITE_TMDB_API_KEY || 'demo_key'
export const TMDB_BASE_URL = import.meta.env.VITE_TMDB_BASE_URL || 'https://api.themoviedb.org/3'
export const TMDB_IMAGE_BASE_URL = import.meta.env.VITE_TMDB_IMAGE_BASE_URL || 'https://image.tmdb.org/t/p'

export const OMDB_API_KEY = import.meta.env.VITE_OMDB_API_KEY || 'demo_key'
export const OMDB_BASE_URL = import.meta.env.VITE_OMDB_BASE_URL || 'https://www.omdbapi.com'

// App Configuration
export const APP_TITLE = import.meta.env.VITE_APP_TITLE || 'Movie Box'
export const APP_DESCRIPTION = import.meta.env.VITE_APP_DESCRIPTION || 'Discover your next favorite movie or TV show'

// Image Sizes
export const IMAGE_SIZES = {
  poster: {
    small: 'w185',
    medium: 'w342',
    large: 'w500',
    xlarge: 'w780',
    original: 'original'
  },
  backdrop: {
    small: 'w300',
    medium: 'w780',
    large: 'w1280',
    original: 'original'
  },
  profile: {
    small: 'w45',
    medium: 'w185',
    large: 'h632',
    original: 'original'
  }
}

// Cache Configuration
export const CACHE_DURATION = {
  SHORT: 5 * 60 * 1000, // 5 minutes
  MEDIUM: 30 * 60 * 1000, // 30 minutes
  LONG: 24 * 60 * 60 * 1000 // 24 hours
}

// Pagination
export const ITEMS_PER_PAGE = 20
export const MAX_PAGES = 500

// Local Storage Keys
export const STORAGE_KEYS = {
  WATCHLIST: 'moviebox_watchlist',
  THEME: 'moviebox_theme',
  SEARCH_HISTORY: 'moviebox_search_history',
  CACHE: 'moviebox_cache'
}

// Media Types
export const MEDIA_TYPES = {
  MOVIE: 'movie',
  TV: 'tv',
  PERSON: 'person'
}

// Genres (will be fetched from API but these are fallbacks)
export const DEFAULT_GENRES = {
  movie: [
    { id: 28, name: 'Action' },
    { id: 12, name: 'Adventure' },
    { id: 16, name: 'Animation' },
    { id: 35, name: 'Comedy' },
    { id: 80, name: 'Crime' },
    { id: 99, name: 'Documentary' },
    { id: 18, name: 'Drama' },
    { id: 10751, name: 'Family' },
    { id: 14, name: 'Fantasy' },
    { id: 36, name: 'History' },
    { id: 27, name: 'Horror' },
    { id: 10402, name: 'Music' },
    { id: 9648, name: 'Mystery' },
    { id: 10749, name: 'Romance' },
    { id: 878, name: 'Science Fiction' },
    { id: 10770, name: 'TV Movie' },
    { id: 53, name: 'Thriller' },
    { id: 10752, name: 'War' },
    { id: 37, name: 'Western' }
  ],
  tv: [
    { id: 10759, name: 'Action & Adventure' },
    { id: 16, name: 'Animation' },
    { id: 35, name: 'Comedy' },
    { id: 80, name: 'Crime' },
    { id: 99, name: 'Documentary' },
    { id: 18, name: 'Drama' },
    { id: 10751, name: 'Family' },
    { id: 10762, name: 'Kids' },
    { id: 9648, name: 'Mystery' },
    { id: 10763, name: 'News' },
    { id: 10764, name: 'Reality' },
    { id: 10765, name: 'Sci-Fi & Fantasy' },
    { id: 10766, name: 'Soap' },
    { id: 10767, name: 'Talk' },
    { id: 10768, name: 'War & Politics' },
    { id: 37, name: 'Western' }
  ]
}

// Sort Options
export const SORT_OPTIONS = [
  { value: 'popularity.desc', label: 'Most Popular' },
  { value: 'popularity.asc', label: 'Least Popular' },
  { value: 'release_date.desc', label: 'Newest First' },
  { value: 'release_date.asc', label: 'Oldest First' },
  { value: 'vote_average.desc', label: 'Highest Rated' },
  { value: 'vote_average.asc', label: 'Lowest Rated' },
  { value: 'title.asc', label: 'A-Z' },
  { value: 'title.desc', label: 'Z-A' }
]

// Error Messages
export const ERROR_MESSAGES = {
  NETWORK: 'Network error. Please check your connection and try again.',
  API_LIMIT: 'API rate limit exceeded. Please try again later.',
  NOT_FOUND: 'Content not found.',
  GENERIC: 'Something went wrong. Please try again.',
  SEARCH_EMPTY: 'Please enter a search term.',
  NO_RESULTS: 'No results found for your search.'
}

// Success Messages
export const SUCCESS_MESSAGES = {
  ADDED_TO_WATCHLIST: 'Added to watchlist!',
  REMOVED_FROM_WATCHLIST: 'Removed from watchlist!',
  WATCHLIST_EXPORTED: 'Watchlist exported successfully!'
}
