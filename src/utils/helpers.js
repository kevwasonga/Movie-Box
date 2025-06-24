import { TMDB_IMAGE_BASE_URL, IMAGE_SIZES } from './constants'

/**
 * Format date to readable string
 * @param {string} dateString - ISO date string
 * @param {object} options - Intl.DateTimeFormat options
 * @returns {string} Formatted date
 */
export const formatDate = (dateString, options = {}) => {
  if (!dateString) return 'Unknown'
  
  const defaultOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }
  
  try {
    return new Date(dateString).toLocaleDateString('en-US', { ...defaultOptions, ...options })
  } catch (error) {
    return 'Invalid Date'
  }
}

/**
 * Format runtime in minutes to hours and minutes
 * @param {number} minutes - Runtime in minutes
 * @returns {string} Formatted runtime
 */
export const formatRuntime = (minutes) => {
  if (!minutes || minutes === 0) return 'Unknown'
  
  const hours = Math.floor(minutes / 60)
  const remainingMinutes = minutes % 60
  
  if (hours === 0) return `${remainingMinutes}m`
  if (remainingMinutes === 0) return `${hours}h`
  
  return `${hours}h ${remainingMinutes}m`
}

/**
 * Format vote average to one decimal place
 * @param {number} voteAverage - Vote average from API
 * @returns {string} Formatted rating
 */
export const formatRating = (voteAverage) => {
  if (!voteAverage || voteAverage === 0) return 'N/A'
  return voteAverage.toFixed(1)
}

/**
 * Format large numbers with K/M suffixes
 * @param {number} num - Number to format
 * @returns {string} Formatted number
 */
export const formatNumber = (num) => {
  if (!num || num === 0) return '0'
  
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M'
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K'
  }
  
  return num.toString()
}

/**
 * Get full image URL from TMDB path
 * @param {string} path - Image path from API
 * @param {string} size - Image size (from IMAGE_SIZES)
 * @param {string} type - Image type (poster, backdrop, profile)
 * @returns {string} Full image URL
 */
export const getImageUrl = (path, size = 'medium', type = 'poster') => {
  if (!path) return null
  
  const sizeMap = IMAGE_SIZES[type]
  const imageSize = sizeMap[size] || sizeMap.medium || 'w500'
  
  return `${TMDB_IMAGE_BASE_URL}/${imageSize}${path}`
}

/**
 * Get placeholder image URL - using data URI to avoid external dependencies
 * @param {number} width - Image width
 * @param {number} height - Image height
 * @param {string} text - Placeholder text
 * @returns {string} Placeholder image data URI
 */
export const getPlaceholderImage = (width = 300, height = 450, text = 'No Image') => {
  // Create a simple SVG placeholder
  const svg = `
    <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      <rect width="100%" height="100%" fill="#374151"/>
      <text x="50%" y="50%" font-family="Arial, sans-serif" font-size="16" fill="#ffffff" text-anchor="middle" dominant-baseline="middle">
        ${text.length > 20 ? text.substring(0, 20) + '...' : text}
      </text>
    </svg>
  `

  // Convert SVG to data URI
  return `data:image/svg+xml;base64,${btoa(svg)}`
}

/**
 * Truncate text to specified length
 * @param {string} text - Text to truncate
 * @param {number} maxLength - Maximum length
 * @returns {string} Truncated text
 */
export const truncateText = (text, maxLength = 150) => {
  if (!text || text.length <= maxLength) return text
  return text.substring(0, maxLength).trim() + '...'
}

/**
 * Debounce function calls
 * @param {Function} func - Function to debounce
 * @param {number} delay - Delay in milliseconds
 * @returns {Function} Debounced function
 */
export const debounce = (func, delay) => {
  let timeoutId
  return (...args) => {
    clearTimeout(timeoutId)
    timeoutId = setTimeout(() => func.apply(null, args), delay)
  }
}

/**
 * Generate unique ID
 * @returns {string} Unique ID
 */
export const generateId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2)
}

/**
 * Check if item is in watchlist
 * @param {Array} watchlist - Current watchlist
 * @param {number} id - Item ID
 * @param {string} mediaType - Media type (movie/tv)
 * @returns {boolean} Is in watchlist
 */
export const isInWatchlist = (watchlist, id, mediaType) => {
  return watchlist.some(item => item.id === id && item.media_type === mediaType)
}

/**
 * Get year from date string
 * @param {string} dateString - ISO date string
 * @returns {string} Year or empty string
 */
export const getYear = (dateString) => {
  if (!dateString) return ''
  try {
    return new Date(dateString).getFullYear().toString()
  } catch (error) {
    return ''
  }
}

/**
 * Capitalize first letter of each word
 * @param {string} str - String to capitalize
 * @returns {string} Capitalized string
 */
export const capitalizeWords = (str) => {
  if (!str) return ''
  return str.replace(/\w\S*/g, (txt) => 
    txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
  )
}

/**
 * Convert snake_case to Title Case
 * @param {string} str - Snake case string
 * @returns {string} Title case string
 */
export const snakeToTitle = (str) => {
  if (!str) return ''
  return str
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

/**
 * Get contrast color (black or white) for background
 * @param {string} hexColor - Hex color code
 * @returns {string} Contrast color
 */
export const getContrastColor = (hexColor) => {
  if (!hexColor) return '#ffffff'
  
  // Remove # if present
  const hex = hexColor.replace('#', '')
  
  // Convert to RGB
  const r = parseInt(hex.substr(0, 2), 16)
  const g = parseInt(hex.substr(2, 2), 16)
  const b = parseInt(hex.substr(4, 2), 16)
  
  // Calculate luminance
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255
  
  return luminance > 0.5 ? '#000000' : '#ffffff'
}

/**
 * Scroll to top of page smoothly
 */
export const scrollToTop = () => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  })
}

/**
 * Copy text to clipboard
 * @param {string} text - Text to copy
 * @returns {Promise<boolean>} Success status
 */
export const copyToClipboard = async (text) => {
  try {
    await navigator.clipboard.writeText(text)
    return true
  } catch (error) {
    // Fallback for older browsers
    const textArea = document.createElement('textarea')
    textArea.value = text
    document.body.appendChild(textArea)
    textArea.select()
    document.execCommand('copy')
    document.body.removeChild(textArea)
    return true
  }
}

/**
 * Download data as JSON file
 * @param {any} data - Data to download
 * @param {string} filename - File name
 */
export const downloadJSON = (data, filename = 'data.json') => {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}
