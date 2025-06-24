import React, { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, X } from 'lucide-react'
import SearchSuggestions from './SearchSuggestions'

const SearchBar = ({ 
  initialValue = '',
  placeholder = 'Search movies and TV shows...',
  onSearch,
  onInputChange,
  showSuggestions = true,
  size = 'medium',
  className = ''
}) => {
  const navigate = useNavigate()
  const [searchInput, setSearchInput] = useState(initialValue)
  const [showSuggestionsDropdown, setShowSuggestionsDropdown] = useState(false)
  const searchRef = useRef(null)

  // Update input when initialValue changes
  useEffect(() => {
    setSearchInput(initialValue)
  }, [initialValue])

  const handleInputChange = (e) => {
    const value = e.target.value
    setSearchInput(value)
    setShowSuggestionsDropdown(true)
    
    if (onInputChange) {
      onInputChange(value)
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (searchInput.trim()) {
      if (onSearch) {
        onSearch(searchInput.trim())
      } else {
        // Default behavior: navigate to search page
        navigate(`/search?q=${encodeURIComponent(searchInput.trim())}`)
      }
      setShowSuggestionsDropdown(false)
    }
  }

  const handleFocus = () => {
    if (showSuggestions) {
      setShowSuggestionsDropdown(true)
    }
  }

  const handleSuggestionClick = (suggestion) => {
    if (suggestion.isRecentSearch || suggestion.isViewAll) {
      // Handle recent search or view all
      setSearchInput(suggestion.displayTitle)
      if (onSearch) {
        onSearch(suggestion.displayTitle)
      } else {
        navigate(`/search?q=${encodeURIComponent(suggestion.displayTitle)}`)
      }
    } else {
      // Navigate to specific movie/TV show
      navigate(`/${suggestion.media_type}/${suggestion.id}`)
    }
    setShowSuggestionsDropdown(false)
  }

  const handleClear = () => {
    setSearchInput('')
    setShowSuggestionsDropdown(false)
    if (onInputChange) {
      onInputChange('')
    }
  }

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSuggestionsDropdown(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Size classes
  const sizeClasses = {
    small: 'py-1 px-3 text-sm',
    medium: 'py-2 px-4 text-base',
    large: 'py-3 px-5 text-lg'
  }

  const iconSizes = {
    small: 'w-3 h-3',
    medium: 'w-4 h-4',
    large: 'w-5 h-5'
  }

  const paddingClasses = {
    small: 'pl-8 pr-8',
    medium: 'pl-10 pr-10',
    large: 'pl-12 pr-12'
  }

  return (
    <form onSubmit={handleSubmit} className={`relative ${className}`}>
      <div ref={searchRef} className="relative">
        {/* Search Icon */}
        <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 ${iconSizes[size]} z-10`} />
        
        {/* Input Field */}
        <input
          type="text"
          value={searchInput}
          onChange={handleInputChange}
          onFocus={handleFocus}
          placeholder={placeholder}
          className={`input-field ${paddingClasses[size]} ${sizeClasses[size]} w-full`}
        />
        
        {/* Clear Button */}
        {searchInput && (
          <button
            type="button"
            onClick={handleClear}
            className={`absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 ${iconSizes[size]}`}
          >
            <X className={iconSizes[size]} />
          </button>
        )}
        
        {/* Search Suggestions */}
        {showSuggestions && (
          <SearchSuggestions
            query={searchInput}
            onSuggestionClick={handleSuggestionClick}
            isVisible={showSuggestionsDropdown}
            className="mt-1"
          />
        )}
      </div>
    </form>
  )
}

export default SearchBar
