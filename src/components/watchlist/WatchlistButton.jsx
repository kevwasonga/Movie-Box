import React, { useState } from 'react'
import { Heart, Plus, Check } from 'lucide-react'
import { useApp } from '../../context/AppContext'

const WatchlistButton = ({ 
  item, 
  variant = 'default', 
  size = 'medium',
  showText = true,
  className = '' 
}) => {
  const { isInWatchlist, toggleWatchlist } = useApp()
  const [isAnimating, setIsAnimating] = useState(false)

  if (!item || !item.id) return null

  const mediaType = item.media_type || 'movie'
  const inWatchlist = isInWatchlist(item.id, mediaType)

  const handleClick = (e) => {
    e.preventDefault()
    e.stopPropagation()
    
    setIsAnimating(true)
    toggleWatchlist(item)
    
    // Reset animation after a short delay
    setTimeout(() => setIsAnimating(false), 300)
  }

  const sizeClasses = {
    small: 'p-1.5',
    medium: 'p-2',
    large: 'p-3'
  }

  const iconSizes = {
    small: 'w-3 h-3',
    medium: 'w-4 h-4',
    large: 'w-5 h-5'
  }

  const textSizes = {
    small: 'text-xs',
    medium: 'text-sm',
    large: 'text-base'
  }

  // Icon-only button (for cards)
  if (variant === 'icon') {
    return (
      <button
        onClick={handleClick}
        className={`${sizeClasses[size]} rounded-full transition-all duration-200 ${
          inWatchlist
            ? 'bg-red-500 text-white hover:bg-red-600'
            : 'bg-black bg-opacity-50 text-white hover:bg-opacity-70'
        } ${isAnimating ? 'scale-110' : 'scale-100'} ${className}`}
        aria-label={inWatchlist ? 'Remove from watchlist' : 'Add to watchlist'}
        title={inWatchlist ? 'Remove from watchlist' : 'Add to watchlist'}
      >
        <Heart 
          className={`${iconSizes[size]} ${inWatchlist ? 'fill-current' : ''} transition-all duration-200`} 
        />
      </button>
    )
  }

  // Full button with text
  const buttonText = inWatchlist ? 'Remove from Watchlist' : 'Add to Watchlist'
  const Icon = inWatchlist ? Check : Plus

  return (
    <button
      onClick={handleClick}
      className={`flex items-center space-x-2 ${sizeClasses[size]} px-4 rounded-lg font-medium transition-all duration-200 ${
        inWatchlist
          ? 'bg-red-500 hover:bg-red-600 text-white'
          : variant === 'primary'
          ? 'bg-primary-600 hover:bg-primary-700 text-white'
          : 'bg-gray-200 hover:bg-gray-300 dark:bg-dark-700 dark:hover:bg-dark-600 text-gray-900 dark:text-gray-100'
      } ${isAnimating ? 'scale-105' : 'scale-100'} ${className}`}
      aria-label={buttonText}
    >
      <div className="flex items-center space-x-1">
        <Heart 
          className={`${iconSizes[size]} ${inWatchlist ? 'fill-current' : ''} transition-all duration-200`} 
        />
        {variant !== 'compact' && (
          <Icon className={`${iconSizes[size]} transition-all duration-200`} />
        )}
      </div>
      {showText && (
        <span className={`${textSizes[size]} transition-all duration-200`}>
          {variant === 'compact' ? (inWatchlist ? 'In Watchlist' : 'Add to Watchlist') : buttonText}
        </span>
      )}
    </button>
  )
}

export default WatchlistButton
