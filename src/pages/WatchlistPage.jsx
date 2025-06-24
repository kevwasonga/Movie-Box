import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { Heart, Download, Trash2, Filter, Film, Tv, Search } from 'lucide-react'
import MovieGrid from '../components/movie/MovieGrid'
import { useApp } from '../context/AppContext'
import watchlistService from '../services/watchlistService'

const WatchlistPage = () => {
  const { watchlist, addNotification } = useApp()
  const [filteredWatchlist, setFilteredWatchlist] = useState(watchlist)
  const [filterType, setFilterType] = useState('all')
  const [sortBy, setSortBy] = useState('added_at')
  const [searchQuery, setSearchQuery] = useState('')

  // Update filtered list when watchlist changes
  React.useEffect(() => {
    applyFilters()
  }, [watchlist, filterType, sortBy, searchQuery])

  const applyFilters = () => {
    let filtered = [...watchlist]

    // Filter by media type
    if (filterType !== 'all') {
      filtered = filtered.filter(item => item.media_type === filterType)
    }

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(item =>
        item.title.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'title':
          return a.title.localeCompare(b.title)
        case 'release_date':
          return new Date(b.release_date || 0) - new Date(a.release_date || 0)
        case 'rating':
          return (b.vote_average || 0) - (a.vote_average || 0)
        case 'added_at':
        default:
          return (b.added_at || 0) - (a.added_at || 0)
      }
    })

    setFilteredWatchlist(filtered)
  }

  const handleExport = () => {
    try {
      watchlistService.export()
      addNotification({
        type: 'success',
        message: 'Watchlist exported successfully!',
        duration: 3000
      })
    } catch (error) {
      addNotification({
        type: 'error',
        message: error.message,
        duration: 3000
      })
    }
  }

  const handleClearWatchlist = () => {
    if (window.confirm('Are you sure you want to clear your entire watchlist? This action cannot be undone.')) {
      try {
        watchlistService.clear()
        addNotification({
          type: 'success',
          message: 'Watchlist cleared successfully!',
          duration: 3000
        })
      } catch (error) {
        addNotification({
          type: 'error',
          message: error.message,
          duration: 3000
        })
      }
    }
  }

  const getStats = () => {
    const movies = watchlist.filter(item => item.media_type === 'movie').length
    const tvShows = watchlist.filter(item => item.media_type === 'tv').length
    const totalRating = watchlist.reduce((sum, item) => sum + (item.vote_average || 0), 0)
    const averageRating = watchlist.length > 0 ? (totalRating / watchlist.length).toFixed(1) : 0

    return { movies, tvShows, averageRating }
  }

  const stats = getStats()

  if (watchlist.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-dark-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center py-16">
            <Heart className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4">
              Your Watchlist is Empty
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-md mx-auto">
              Start building your watchlist by adding movies and TV shows you want to watch later.
            </p>
            <Link
              to="/"
              className="btn-primary"
            >
              Discover Content
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-dark-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                My Watchlist
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                {watchlist.length} {watchlist.length === 1 ? 'item' : 'items'} saved
              </p>
            </div>

            <div className="flex items-center space-x-3 mt-4 sm:mt-0">
              {watchlist.length > 0 && (
                <>
                  <button
                    onClick={handleExport}
                    className="btn-secondary flex items-center space-x-2"
                  >
                    <Download className="w-4 h-4" />
                    <span>Export</span>
                  </button>
                  <button
                    onClick={handleClearWatchlist}
                    className="btn-secondary text-red-600 hover:text-red-700 flex items-center space-x-2"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span>Clear All</span>
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
            <div className="bg-white dark:bg-dark-800 p-4 rounded-lg border border-gray-200 dark:border-dark-700">
              <div className="flex items-center space-x-2">
                <Film className="w-5 h-5 text-blue-500" />
                <span className="text-sm text-gray-600 dark:text-gray-400">Movies</span>
              </div>
              <p className="text-2xl font-bold text-gray-900 dark:text-gray-100 mt-1">
                {stats.movies}
              </p>
            </div>
            <div className="bg-white dark:bg-dark-800 p-4 rounded-lg border border-gray-200 dark:border-dark-700">
              <div className="flex items-center space-x-2">
                <Tv className="w-5 h-5 text-green-500" />
                <span className="text-sm text-gray-600 dark:text-gray-400">TV Shows</span>
              </div>
              <p className="text-2xl font-bold text-gray-900 dark:text-gray-100 mt-1">
                {stats.tvShows}
              </p>
            </div>
            <div className="bg-white dark:bg-dark-800 p-4 rounded-lg border border-gray-200 dark:border-dark-700">
              <div className="flex items-center space-x-2">
                <Heart className="w-5 h-5 text-red-500" />
                <span className="text-sm text-gray-600 dark:text-gray-400">Avg Rating</span>
              </div>
              <p className="text-2xl font-bold text-gray-900 dark:text-gray-100 mt-1">
                {stats.averageRating}
              </p>
            </div>
          </div>

          {/* Filters and Search */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search your watchlist..."
                className="input-field pl-10 pr-4 py-2 w-full"
              />
            </div>

            {/* Filter by Type */}
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="input-field"
            >
              <option value="all">All Types</option>
              <option value="movie">Movies</option>
              <option value="tv">TV Shows</option>
            </select>

            {/* Sort */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="input-field"
            >
              <option value="added_at">Recently Added</option>
              <option value="title">Title A-Z</option>
              <option value="release_date">Release Date</option>
              <option value="rating">Rating</option>
            </select>
          </div>
        </div>

        {/* Watchlist Grid */}
        <MovieGrid
          items={filteredWatchlist}
          emptyMessage={
            searchQuery || filterType !== 'all'
              ? "No items match your current filters."
              : "Your watchlist is empty."
          }
        />
      </div>
    </div>
  )
}

export default WatchlistPage
