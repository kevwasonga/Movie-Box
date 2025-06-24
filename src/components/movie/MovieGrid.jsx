import React from 'react'
import MovieCard from './MovieCard'
import LoadingSpinner from '../common/LoadingSpinner'
import ErrorMessage from '../common/ErrorMessage'

const MovieGrid = ({ 
  items = [], 
  loading = false, 
  error = null, 
  onRetry = null,
  emptyMessage = 'No movies or TV shows found.',
  showWatchlistButton = true,
  className = '' 
}) => {
  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <LoadingSpinner size="large" text="Loading content..." />
      </div>
    )
  }

  if (error) {
    return (
      <div className="py-12">
        <ErrorMessage 
          error={error} 
          onRetry={onRetry}
          className="max-w-md mx-auto"
        />
      </div>
    )
  }

  if (!items || items.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-500 dark:text-gray-400 text-lg">
          {emptyMessage}
        </div>
      </div>
    )
  }

  return (
    <div className={`grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6 ${className}`}>
      {items.map((item) => (
        <MovieCard
          key={`${item.id}-${item.media_type || 'movie'}`}
          item={item}
          showWatchlistButton={showWatchlistButton}
        />
      ))}
    </div>
  )
}

export default MovieGrid
