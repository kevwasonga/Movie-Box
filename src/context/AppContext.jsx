import React, { createContext, useContext, useReducer, useEffect } from 'react'
import { STORAGE_KEYS } from '../utils/constants'
import watchlistService from '../services/watchlistService'

// Initial state
const initialState = {
  // Theme
  theme: 'light',
  
  // Watchlist
  watchlist: [],
  
  // Search
  searchQuery: '',
  searchResults: [],
  searchLoading: false,
  searchError: null,
  
  // Genres
  movieGenres: [],
  tvGenres: [],
  
  // Loading states
  loading: false,
  error: null,
  
  // Notifications
  notifications: [],
}

// Action types
const ActionTypes = {
  SET_THEME: 'SET_THEME',
  SET_LOADING: 'SET_LOADING',
  SET_ERROR: 'SET_ERROR',
  CLEAR_ERROR: 'CLEAR_ERROR',
  
  // Watchlist actions
  SET_WATCHLIST: 'SET_WATCHLIST',
  ADD_TO_WATCHLIST: 'ADD_TO_WATCHLIST',
  REMOVE_FROM_WATCHLIST: 'REMOVE_FROM_WATCHLIST',
  
  // Search actions
  SET_SEARCH_QUERY: 'SET_SEARCH_QUERY',
  SET_SEARCH_RESULTS: 'SET_SEARCH_RESULTS',
  SET_SEARCH_LOADING: 'SET_SEARCH_LOADING',
  SET_SEARCH_ERROR: 'SET_SEARCH_ERROR',
  CLEAR_SEARCH: 'CLEAR_SEARCH',
  
  // Genres
  SET_MOVIE_GENRES: 'SET_MOVIE_GENRES',
  SET_TV_GENRES: 'SET_TV_GENRES',
  
  // Notifications
  ADD_NOTIFICATION: 'ADD_NOTIFICATION',
  REMOVE_NOTIFICATION: 'REMOVE_NOTIFICATION',
  CLEAR_NOTIFICATIONS: 'CLEAR_NOTIFICATIONS',
}

// Reducer function
const appReducer = (state, action) => {
  switch (action.type) {
    case ActionTypes.SET_THEME:
      return { ...state, theme: action.payload }
    
    case ActionTypes.SET_LOADING:
      return { ...state, loading: action.payload }
    
    case ActionTypes.SET_ERROR:
      return { ...state, error: action.payload, loading: false }
    
    case ActionTypes.CLEAR_ERROR:
      return { ...state, error: null }
    
    case ActionTypes.SET_WATCHLIST:
      return { ...state, watchlist: action.payload }
    
    case ActionTypes.ADD_TO_WATCHLIST:
      return { ...state, watchlist: [action.payload, ...state.watchlist] }
    
    case ActionTypes.REMOVE_FROM_WATCHLIST:
      return {
        ...state,
        watchlist: state.watchlist.filter(
          item => !(item.id === action.payload.id && item.media_type === action.payload.media_type)
        )
      }
    
    case ActionTypes.SET_SEARCH_QUERY:
      return { ...state, searchQuery: action.payload }
    
    case ActionTypes.SET_SEARCH_RESULTS:
      return { ...state, searchResults: action.payload, searchLoading: false, searchError: null }
    
    case ActionTypes.SET_SEARCH_LOADING:
      return { ...state, searchLoading: action.payload }
    
    case ActionTypes.SET_SEARCH_ERROR:
      return { ...state, searchError: action.payload, searchLoading: false }
    
    case ActionTypes.CLEAR_SEARCH:
      return {
        ...state,
        searchQuery: '',
        searchResults: [],
        searchLoading: false,
        searchError: null
      }
    
    case ActionTypes.SET_MOVIE_GENRES:
      return { ...state, movieGenres: action.payload }
    
    case ActionTypes.SET_TV_GENRES:
      return { ...state, tvGenres: action.payload }
    
    case ActionTypes.ADD_NOTIFICATION:
      return {
        ...state,
        notifications: [...state.notifications, { ...action.payload, id: Date.now() }]
      }
    
    case ActionTypes.REMOVE_NOTIFICATION:
      return {
        ...state,
        notifications: state.notifications.filter(notification => notification.id !== action.payload)
      }
    
    case ActionTypes.CLEAR_NOTIFICATIONS:
      return { ...state, notifications: [] }
    
    default:
      return state
  }
}

// Create context
const AppContext = createContext()

// Context provider component
export const AppProvider = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState)

  // Initialize app on mount
  useEffect(() => {
    initializeApp()
  }, [])

  // Initialize app data
  const initializeApp = () => {
    // Load theme from localStorage
    const savedTheme = localStorage.getItem(STORAGE_KEYS.THEME)
    if (savedTheme && ['light', 'dark'].includes(savedTheme)) {
      setTheme(savedTheme)
    }

    // Load watchlist
    const watchlist = watchlistService.get()
    dispatch({ type: ActionTypes.SET_WATCHLIST, payload: watchlist })
  }

  // Theme actions
  const setTheme = (theme) => {
    dispatch({ type: ActionTypes.SET_THEME, payload: theme })
    localStorage.setItem(STORAGE_KEYS.THEME, theme)
    
    // Apply theme to document
    if (theme === 'dark') {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }

  const toggleTheme = () => {
    const newTheme = state.theme === 'light' ? 'dark' : 'light'
    setTheme(newTheme)
  }

  // Loading and error actions
  const setLoading = (loading) => {
    dispatch({ type: ActionTypes.SET_LOADING, payload: loading })
  }

  const setError = (error) => {
    dispatch({ type: ActionTypes.SET_ERROR, payload: error })
  }

  const clearError = () => {
    dispatch({ type: ActionTypes.CLEAR_ERROR })
  }

  // Watchlist actions
  const addToWatchlist = (item) => {
    try {
      const updatedWatchlist = watchlistService.add(item)
      dispatch({ type: ActionTypes.SET_WATCHLIST, payload: updatedWatchlist })
      addNotification({
        type: 'success',
        message: 'Added to watchlist!',
        duration: 3000
      })
      return true
    } catch (error) {
      addNotification({
        type: 'error',
        message: error.message,
        duration: 3000
      })
      return false
    }
  }

  const removeFromWatchlist = (id, mediaType) => {
    try {
      const updatedWatchlist = watchlistService.remove(id, mediaType)
      dispatch({ type: ActionTypes.SET_WATCHLIST, payload: updatedWatchlist })
      addNotification({
        type: 'success',
        message: 'Removed from watchlist!',
        duration: 3000
      })
      return true
    } catch (error) {
      addNotification({
        type: 'error',
        message: error.message,
        duration: 3000
      })
      return false
    }
  }

  const toggleWatchlist = (item) => {
    try {
      const result = watchlistService.toggle(item)
      dispatch({ type: ActionTypes.SET_WATCHLIST, payload: result.watchlist })
      addNotification({
        type: 'success',
        message: result.message,
        duration: 3000
      })
      return result.action
    } catch (error) {
      addNotification({
        type: 'error',
        message: error.message,
        duration: 3000
      })
      return null
    }
  }

  const isInWatchlist = (id, mediaType) => {
    return watchlistService.isInWatchlist(id, mediaType)
  }

  // Search actions
  const setSearchQuery = (query) => {
    dispatch({ type: ActionTypes.SET_SEARCH_QUERY, payload: query })
  }

  const setSearchResults = (results) => {
    dispatch({ type: ActionTypes.SET_SEARCH_RESULTS, payload: results })
  }

  const setSearchLoading = (loading) => {
    dispatch({ type: ActionTypes.SET_SEARCH_LOADING, payload: loading })
  }

  const setSearchError = (error) => {
    dispatch({ type: ActionTypes.SET_SEARCH_ERROR, payload: error })
  }

  const clearSearch = () => {
    dispatch({ type: ActionTypes.CLEAR_SEARCH })
  }

  // Genre actions
  const setMovieGenres = (genres) => {
    dispatch({ type: ActionTypes.SET_MOVIE_GENRES, payload: genres })
  }

  const setTvGenres = (genres) => {
    dispatch({ type: ActionTypes.SET_TV_GENRES, payload: genres })
  }

  // Notification actions
  const addNotification = (notification) => {
    dispatch({ type: ActionTypes.ADD_NOTIFICATION, payload: notification })
    
    // Auto-remove notification after duration
    if (notification.duration) {
      setTimeout(() => {
        removeNotification(notification.id || Date.now())
      }, notification.duration)
    }
  }

  const removeNotification = (id) => {
    dispatch({ type: ActionTypes.REMOVE_NOTIFICATION, payload: id })
  }

  const clearNotifications = () => {
    dispatch({ type: ActionTypes.CLEAR_NOTIFICATIONS })
  }

  // Context value
  const value = {
    // State
    ...state,
    
    // Theme actions
    setTheme,
    toggleTheme,
    
    // Loading and error actions
    setLoading,
    setError,
    clearError,
    
    // Watchlist actions
    addToWatchlist,
    removeFromWatchlist,
    toggleWatchlist,
    isInWatchlist,
    
    // Search actions
    setSearchQuery,
    setSearchResults,
    setSearchLoading,
    setSearchError,
    clearSearch,
    
    // Genre actions
    setMovieGenres,
    setTvGenres,
    
    // Notification actions
    addNotification,
    removeNotification,
    clearNotifications,
  }

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  )
}

// Custom hook to use the context
export const useApp = () => {
  const context = useContext(AppContext)
  if (!context) {
    throw new Error('useApp must be used within an AppProvider')
  }
  return context
}

export default AppContext
