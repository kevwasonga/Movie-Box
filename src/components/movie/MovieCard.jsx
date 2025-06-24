import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { Heart, Star, Calendar, Play } from 'lucide-react'
import { useApp } from '../../context/AppContext'
import { getImageUrl, getPlaceholderImage, formatDate, formatRating, getYear } from '../../utils/helpers'

const MovieCard = ({ 
  item, 
  showWatchlistButton = true,
  className = '' 
}) => {
  const { isInWatchlist, toggleWatchlist } = useApp()
  const [imageError, setImageError] = useState(false)
  const [imageLoading, setImageLoading] = useState(true)

  if (!item) return null

  const {
    id,
    title,
    name,
    poster_path,
    release_date,
    first_air_date,
    vote_average,
    overview,
    media_type = 'movie'
  } = item

  const displayTitle = title || name
  const displayDate = release_date || first_air_date
  const isMovie = media_type === 'movie'
  const detailPath = `/${media_type}/${id}`
  
  const inWatchlist = isInWatchlist(id, media_type)
  
  const handleWatchlistToggle = (e) => {
    e.preventDefault()
    e.stopPropagation()
    toggleWatchlist(item)
  }

  const handleImageLoad = () => {
    setImageLoading(false)
  }

  const handleImageError = () => {
    setImageError(true)
    setImageLoading(false)
  }

  const posterUrl = poster_path && !imageError 
    ? getImageUrl(poster_path, 'medium', 'poster')
    : getPlaceholderImage(342, 513, displayTitle)

  return (
    <div className={`card group hover:scale-105 transition-all duration-300 ${className}`}>
      <Link to={detailPath} className="block">
        {/* Poster Image */}
        <div className="relative movie-poster overflow-hidden rounded-t-lg bg-gray-200 dark:bg-dark-700">
          {imageLoading && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="loading-spinner w-8 h-8"></div>
            </div>
          )}
          
          <img
            src={posterUrl}
            alt={displayTitle}
            onLoad={handleImageLoad}
            onError={handleImageError}
            className={`w-full h-full object-cover transition-opacity duration-300 ${
              imageLoading ? 'opacity-0' : 'opacity-100'
            }`}
          />
          
          {/* Overlay on hover */}
          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300 flex items-center justify-center">
            <Play className="w-12 h-12 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </div>
          
          {/* Rating Badge */}
          {vote_average > 0 && (
            <div className="absolute top-2 left-2 bg-black bg-opacity-70 text-white px-2 py-1 rounded-lg text-sm font-medium flex items-center space-x-1">
              <Star className="w-3 h-3 fill-current text-yellow-400" />
              <span>{formatRating(vote_average)}</span>
            </div>
          )}
          
          {/* Watchlist Button */}
          {showWatchlistButton && (
            <button
              onClick={handleWatchlistToggle}
              className={`absolute top-2 right-2 p-2 rounded-full transition-all duration-200 ${
                inWatchlist
                  ? 'bg-red-500 text-white'
                  : 'bg-black bg-opacity-50 text-white hover:bg-opacity-70'
              }`}
              aria-label={inWatchlist ? 'Remove from watchlist' : 'Add to watchlist'}
            >
              <Heart 
                className={`w-4 h-4 ${inWatchlist ? 'fill-current' : ''}`} 
              />
            </button>
          )}
        </div>

        {/* Content */}
        <div className="p-4">
          {/* Title */}
          <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2 line-clamp-2 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
            {displayTitle}
          </h3>
          
          {/* Release Date */}
          {displayDate && (
            <div className="flex items-center space-x-1 text-sm text-gray-600 dark:text-gray-400 mb-2">
              <Calendar className="w-3 h-3" />
              <span>{getYear(displayDate)}</span>
            </div>
          )}
          
          {/* Overview */}
          {overview && (
            <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-3">
              {overview}
            </p>
          )}
          
          {/* Media Type Badge */}
          <div className="mt-3 flex items-center justify-between">
            <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
              isMovie
                ? 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200'
                : 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200'
            }`}>
              {isMovie ? 'Movie' : 'TV Show'}
            </span>
          </div>
        </div>
      </Link>
    </div>
  )
}

export default MovieCard
