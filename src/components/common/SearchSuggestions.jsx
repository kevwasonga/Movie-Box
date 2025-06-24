import React, { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { Search, Film, Tv, Clock, X } from 'lucide-react'
import { getImageUrl, getPlaceholderImage, getYear } from '../../utils/helpers'
import { debounce } from '../../utils/helpers'
import apiService from '../../services/apiService'

const SearchSuggestions = ({ 
  query, 
  onSuggestionClick, 
  onClear,
  isVisible,
  className = '' 
}) => {
  const [suggestions, setSuggestions] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [recentSearches, setRecentSearches] = useState([])
  const suggestionsRef = useRef(null)

  // Load recent searches from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('moviebox_recent_searches')
    if (saved) {
      try {
        setRecentSearches(JSON.parse(saved))
      } catch (error) {
        console.error('Error loading recent searches:', error)
      }
    }
  }, [])

  // Debounced search function
  const debouncedSearch = debounce(async (searchQuery) => {
    if (!searchQuery.trim() || searchQuery.length < 2) {
      setSuggestions([])
      setLoading(false)
      return
    }

    try {
      setLoading(true)
      setError(null)
      
      const response = await apiService.general.multiSearch(searchQuery, 1)
      
      // Filter and limit results
      const filteredResults = response.results
        .filter(item => item.media_type === 'movie' || item.media_type === 'tv')
        .slice(0, 8) // Limit to 8 suggestions
        .map(item => ({
          ...item,
          displayTitle: item.title || item.name,
          displayDate: item.release_date || item.first_air_date
        }))
      
      setSuggestions(filteredResults)
    } catch (err) {
      console.error('Search suggestions error:', err)
      setError(err.message)
      setSuggestions([])
    } finally {
      setLoading(false)
    }
  }, 300)

  // Trigger search when query changes
  useEffect(() => {
    if (query && query.length >= 2) {
      setLoading(true)
      debouncedSearch(query)
    } else {
      setSuggestions([])
      setLoading(false)
    }
  }, [query])

  // Save search to recent searches
  const saveRecentSearch = (searchTerm) => {
    const newRecentSearches = [
      searchTerm,
      ...recentSearches.filter(term => term !== searchTerm)
    ].slice(0, 5) // Keep only 5 recent searches

    setRecentSearches(newRecentSearches)
    localStorage.setItem('moviebox_recent_searches', JSON.stringify(newRecentSearches))
  }

  // Handle suggestion click
  const handleSuggestionClick = (suggestion) => {
    saveRecentSearch(suggestion.displayTitle)
    onSuggestionClick(suggestion)
  }

  // Handle recent search click
  const handleRecentSearchClick = (searchTerm) => {
    onSuggestionClick({ displayTitle: searchTerm, isRecentSearch: true })
  }

  // Clear recent searches
  const clearRecentSearches = () => {
    setRecentSearches([])
    localStorage.removeItem('moviebox_recent_searches')
  }

  if (!isVisible) return null

  return (
    <div 
      ref={suggestionsRef}
      className={`absolute top-full left-0 right-0 bg-white dark:bg-dark-800 border border-gray-200 dark:border-dark-600 rounded-lg shadow-lg z-50 max-h-96 overflow-y-auto ${className}`}
    >
      {/* Loading State */}
      {loading && (
        <div className="p-4 text-center">
          <div className="flex items-center justify-center space-x-2">
            <div className="loading-spinner w-4 h-4"></div>
            <span className="text-sm text-gray-600 dark:text-gray-400">Searching...</span>
          </div>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="p-4 text-center">
          <span className="text-sm text-red-600 dark:text-red-400">{error}</span>
        </div>
      )}

      {/* No query or too short */}
      {(!query || query.length < 2) && !loading && (
        <div className="p-4">
          {/* Recent Searches */}
          {recentSearches.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100 flex items-center space-x-2">
                  <Clock className="w-4 h-4" />
                  <span>Recent Searches</span>
                </h3>
                <button
                  onClick={clearRecentSearches}
                  className="text-xs text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                >
                  Clear
                </button>
              </div>
              <div className="space-y-1">
                {recentSearches.map((searchTerm, index) => (
                  <button
                    key={index}
                    onClick={() => handleRecentSearchClick(searchTerm)}
                    className="w-full text-left px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-dark-700 rounded-md transition-colors"
                  >
                    <div className="flex items-center space-x-2">
                      <Search className="w-3 h-3 text-gray-400" />
                      <span>{searchTerm}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Search Tips */}
          {recentSearches.length === 0 && (
            <div className="text-center py-6">
              <Search className="w-8 h-8 text-gray-400 mx-auto mb-2" />
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Start typing to search for movies and TV shows
              </p>
            </div>
          )}
        </div>
      )}

      {/* Search Suggestions */}
      {suggestions.length > 0 && !loading && (
        <div className="p-2">
          <div className="space-y-1">
            {suggestions.map((suggestion) => (
              <Link
                key={`${suggestion.id}-${suggestion.media_type}`}
                to={`/${suggestion.media_type}/${suggestion.id}`}
                onClick={() => handleSuggestionClick(suggestion)}
                className="flex items-center space-x-3 p-3 hover:bg-gray-100 dark:hover:bg-dark-700 rounded-lg transition-colors"
              >
                {/* Poster */}
                <div className="flex-shrink-0 w-12 h-16 bg-gray-200 dark:bg-dark-600 rounded overflow-hidden">
                  <img
                    src={
                      suggestion.poster_path
                        ? getImageUrl(suggestion.poster_path, 'small', 'poster')
                        : getPlaceholderImage(92, 138, suggestion.displayTitle)
                    }
                    alt={suggestion.displayTitle}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.src = getPlaceholderImage(92, 138, suggestion.displayTitle)
                    }}
                  />
                </div>

                {/* Details */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2 mb-1">
                    {suggestion.media_type === 'movie' ? (
                      <Film className="w-3 h-3 text-blue-500" />
                    ) : (
                      <Tv className="w-3 h-3 text-green-500" />
                    )}
                    <span className="text-xs text-gray-500 dark:text-gray-400 capitalize">
                      {suggestion.media_type === 'tv' ? 'TV Show' : 'Movie'}
                    </span>
                  </div>
                  
                  <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                    {suggestion.displayTitle}
                  </h4>
                  
                  {suggestion.displayDate && (
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      {getYear(suggestion.displayDate)}
                    </p>
                  )}
                  
                  {suggestion.vote_average > 0 && (
                    <div className="flex items-center space-x-1 mt-1">
                      <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                      <span className="text-xs text-gray-600 dark:text-gray-400">
                        {suggestion.vote_average.toFixed(1)}
                      </span>
                    </div>
                  )}
                </div>
              </Link>
            ))}
          </div>

          {/* View All Results */}
          <div className="border-t border-gray-200 dark:border-dark-600 mt-2 pt-2">
            <button
              onClick={() => onSuggestionClick({ displayTitle: query, isViewAll: true })}
              className="w-full text-left px-3 py-2 text-sm text-primary-600 dark:text-primary-400 hover:bg-gray-100 dark:hover:bg-dark-700 rounded-md transition-colors"
            >
              <div className="flex items-center space-x-2">
                <Search className="w-3 h-3" />
                <span>View all results for "{query}"</span>
              </div>
            </button>
          </div>
        </div>
      )}

      {/* No Results */}
      {query && query.length >= 2 && suggestions.length === 0 && !loading && !error && (
        <div className="p-4 text-center">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            No results found for "{query}"
          </p>
        </div>
      )}
    </div>
  )
}

export default SearchSuggestions
