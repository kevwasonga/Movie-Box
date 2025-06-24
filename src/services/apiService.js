// API Service wrapper that handles both real TMDB API and demo mode
import { isApiConfigured } from '../utils/constants'
import tmdbApiService from './tmdbApi'
import demoApi from './demoApi'

// Check if we should use demo mode
const shouldUseDemoMode = () => {
  return !isApiConfigured()
}

// Create a wrapper that automatically switches between real and demo API
const createApiWrapper = (realApi, demoApiSection) => {
  const wrapper = {}
  
  // Get all methods from the real API
  const methods = Object.keys(realApi)
  
  methods.forEach(method => {
    wrapper[method] = async (...args) => {
      if (shouldUseDemoMode()) {
        // Use demo API
        if (demoApiSection && demoApiSection[method]) {
          return await demoApiSection[method](...args)
        } else {
          // Fallback for methods not implemented in demo
          throw new Error(`Demo mode: ${method} is not available. Please configure your TMDB API key.`)
        }
      } else {
        // Use real API
        return await realApi[method](...args)
      }
    }
  })
  
  return wrapper
}

// Create wrapped API services
export const movieApi = createApiWrapper(tmdbApiService.movie, demoApi.movie)
export const tvApi = createApiWrapper(tmdbApiService.tv, demoApi.tv)
export const generalApi = createApiWrapper(tmdbApiService.general, demoApi.general)
export const personApi = createApiWrapper(tmdbApiService.person, null) // No demo for person API

// Main API service object
const apiService = {
  movie: movieApi,
  tv: tvApi,
  general: generalApi,
  person: personApi,
  
  // Utility methods
  isUsingDemoMode: shouldUseDemoMode,
  isConfigured: isApiConfigured,
  
  // Get configuration status
  getStatus: () => ({
    configured: isApiConfigured(),
    demoMode: shouldUseDemoMode(),
    message: shouldUseDemoMode() 
      ? 'Using demo mode. Configure your TMDB API key for full functionality.'
      : 'API configured and ready.'
  })
}

export default apiService
