import React, { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Search, Filter, X } from 'lucide-react'
import MovieGrid from '../components/movie/MovieGrid'
import LoadingSpinner from '../components/common/LoadingSpinner'
import apiService from '../services/apiService'
import { useApp } from '../context/AppContext'
import { debounce } from '../utils/helpers'

const SearchPage = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const { searchQuery, setSearchQuery } = useApp()
  
  const [searchInput, setSearchInput] = useState(searchParams.get('q') || searchQuery || '')
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(0)
  const [totalResults, setTotalResults] = useState(0)
  
  // Filters
  const [showFilters, setShowFilters] = useState(false)
  const [mediaType, setMediaType] = useState(searchParams.get('type') || 'all')
  const [year, setYear] = useState(searchParams.get('year') || '')

  // Debounced search function
  const debouncedSearch = debounce((query) => {
    if (query.trim()) {
      performSearch(query, 1)
    } else {
      setResults([])
      setTotalPages(0)
      setTotalResults(0)
    }
  }, 500)

  useEffect(() => {
    const query = searchParams.get('q')
    if (query) {
      setSearchInput(query)
      setSearchQuery(query)
      performSearch(query, 1)
    }
  }, [searchParams])

  useEffect(() => {
    debouncedSearch(searchInput)
  }, [searchInput, mediaType, year])

  const performSearch = async (query, page = 1) => {
    if (!query.trim()) return

    try {
      setLoading(true)
      setError(null)
      setCurrentPage(page)

      let response
      if (mediaType === 'all') {
        response = await apiService.general.multiSearch(query, page)
      } else if (mediaType === 'movie') {
        response = await apiService.movie.search(query, page)
      } else if (mediaType === 'tv') {
        response = await apiService.tv.search(query, page)
      }

      // Filter by year if specified
      let filteredResults = response.results || []
      if (year) {
        filteredResults = filteredResults.filter(item => {
          const itemYear = new Date(item.release_date || item.first_air_date || '').getFullYear()
          return itemYear.toString() === year
        })
      }

      // Add media_type for multi search results
      const processedResults = filteredResults.map(item => ({
        ...item,
        media_type: item.media_type || mediaType === 'all' ? item.media_type : mediaType
      }))

      if (page === 1) {
        setResults(processedResults)
      } else {
        setResults(prev => [...prev, ...processedResults])
      }

      setTotalPages(response.total_pages || 0)
      setTotalResults(response.total_results || 0)

      // Update URL
      const params = new URLSearchParams()
      params.set('q', query)
      if (mediaType !== 'all') params.set('type', mediaType)
      if (year) params.set('year', year)
      setSearchParams(params)

    } catch (error) {
      console.error('Search error:', error)
      setError(error.message)
      setResults([])
    } finally {
      setLoading(false)
    }
  }

  const handleSearchSubmit = (e) => {
    e.preventDefault()
    if (searchInput.trim()) {
      setSearchQuery(searchInput.trim())
      performSearch(searchInput.trim(), 1)
    }
  }

  const handleLoadMore = () => {
    if (currentPage < totalPages && !loading) {
      performSearch(searchInput, currentPage + 1)
    }
  }

  const clearFilters = () => {
    setMediaType('all')
    setYear('')
    setSearchParams({ q: searchInput })
  }

  const hasActiveFilters = mediaType !== 'all' || year

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-dark-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-6">
            Search Movies & TV Shows
          </h1>

          {/* Search Form */}
          <form onSubmit={handleSearchSubmit} className="mb-6">
            <div className="relative max-w-2xl">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Search for movies, TV shows..."
                className="input-field pl-12 pr-4 py-3 text-lg w-full"
              />
            </div>
          </form>

          {/* Filters */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="btn-secondary flex items-center space-x-2 w-fit"
            >
              <Filter className="w-4 h-4" />
              <span>Filters</span>
              {hasActiveFilters && (
                <span className="bg-primary-600 text-white text-xs rounded-full px-2 py-0.5">
                  {[mediaType !== 'all' ? 1 : 0, year ? 1 : 0].reduce((a, b) => a + b, 0)}
                </span>
              )}
            </button>

            {/* Results Count */}
            {totalResults > 0 && (
              <p className="text-gray-600 dark:text-gray-400">
                Found {totalResults.toLocaleString()} results
                {searchInput && ` for "${searchInput}"`}
              </p>
            )}
          </div>

          {/* Filter Panel */}
          {showFilters && (
            <div className="mt-4 p-4 bg-white dark:bg-dark-800 rounded-lg border border-gray-200 dark:border-dark-700">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {/* Media Type Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Type
                  </label>
                  <select
                    value={mediaType}
                    onChange={(e) => setMediaType(e.target.value)}
                    className="input-field"
                  >
                    <option value="all">All</option>
                    <option value="movie">Movies</option>
                    <option value="tv">TV Shows</option>
                  </select>
                </div>

                {/* Year Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Year
                  </label>
                  <input
                    type="number"
                    value={year}
                    onChange={(e) => setYear(e.target.value)}
                    placeholder="e.g. 2023"
                    min="1900"
                    max={new Date().getFullYear() + 5}
                    className="input-field"
                  />
                </div>

                {/* Clear Filters */}
                <div className="flex items-end">
                  {hasActiveFilters && (
                    <button
                      onClick={clearFilters}
                      className="btn-secondary flex items-center space-x-2 w-full"
                    >
                      <X className="w-4 h-4" />
                      <span>Clear Filters</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Results */}
        <div>
          <MovieGrid
            items={results}
            loading={loading && currentPage === 1}
            error={error}
            onRetry={() => performSearch(searchInput, 1)}
            emptyMessage={
              searchInput 
                ? `No results found for "${searchInput}"`
                : "Enter a search term to find movies and TV shows"
            }
          />

          {/* Load More Button */}
          {results.length > 0 && currentPage < totalPages && (
            <div className="flex justify-center mt-8">
              <button
                onClick={handleLoadMore}
                disabled={loading}
                className="btn-primary flex items-center space-x-2"
              >
                {loading ? (
                  <LoadingSpinner size="small" text="" />
                ) : (
                  <span>Load More</span>
                )}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default SearchPage
