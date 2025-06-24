import React, { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { ArrowLeft, Heart, Star, Calendar, Clock, Play } from 'lucide-react'
import LoadingSpinner from '../components/common/LoadingSpinner'
import ErrorMessage from '../components/common/ErrorMessage'
import MovieGrid from '../components/movie/MovieGrid'
import { useApp } from '../context/AppContext'
import tmdbApi from '../services/tmdbApi'
import omdbApi from '../services/omdbApi'
import { getImageUrl, getPlaceholderImage, formatDate, formatRuntime, formatRating } from '../utils/helpers'

const MovieDetailsPage = () => {
  const { id } = useParams()
  const { isInWatchlist, toggleWatchlist } = useApp()
  const [details, setDetails] = useState(null)
  const [additionalDetails, setAdditionalDetails] = useState(null)
  const [similar, setSimilar] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Determine if this is a movie or TV show from the URL
  const isMovie = window.location.pathname.includes('/movie/')
  const mediaType = isMovie ? 'movie' : 'tv'

  useEffect(() => {
    if (id) {
      loadDetails()
    }
  }, [id, mediaType])

  const loadDetails = async () => {
    try {
      setLoading(true)
      setError(null)

      // Load main details
      const detailsResponse = isMovie 
        ? await tmdbApi.movie.getDetails(id)
        : await tmdbApi.tv.getDetails(id)
      
      setDetails(detailsResponse)

      // Load similar content
      const similarResponse = isMovie
        ? await tmdbApi.movie.getSimilar(id)
        : await tmdbApi.tv.getSimilar(id)
      
      setSimilar(similarResponse.results?.slice(0, 12) || [])

      // Load additional details from OMDB if available
      if (detailsResponse.imdb_id && omdbApi.isAvailable()) {
        try {
          const omdbDetails = await omdbApi.getAdditionalDetails(detailsResponse.imdb_id)
          setAdditionalDetails(omdbDetails)
        } catch (omdbError) {
          console.warn('Failed to load OMDB details:', omdbError)
        }
      }

    } catch (error) {
      console.error('Error loading details:', error)
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  const handleWatchlistToggle = () => {
    if (details) {
      toggleWatchlist({
        ...details,
        media_type: mediaType,
        title: details.title || details.name
      })
    }
  }

  if (loading) {
    return <LoadingSpinner fullScreen text="Loading details..." />
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-dark-900 flex items-center justify-center">
        <ErrorMessage 
          error={error} 
          onRetry={loadDetails}
          showHomeLink
        />
      </div>
    )
  }

  if (!details) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-dark-900 flex items-center justify-center">
        <ErrorMessage 
          error="Content not found" 
          showHomeLink
        />
      </div>
    )
  }

  const {
    title,
    name,
    overview,
    poster_path,
    backdrop_path,
    release_date,
    first_air_date,
    vote_average,
    runtime,
    episode_run_time,
    genres,
    credits
  } = details

  const displayTitle = title || name
  const displayDate = release_date || first_air_date
  const displayRuntime = runtime || (episode_run_time && episode_run_time[0])
  const inWatchlist = isInWatchlist(parseInt(id), mediaType)

  const backdropUrl = backdrop_path 
    ? getImageUrl(backdrop_path, 'large', 'backdrop')
    : null

  const posterUrl = poster_path
    ? getImageUrl(poster_path, 'large', 'poster')
    : getPlaceholderImage(500, 750, displayTitle)

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-dark-900">
      {/* Hero Section */}
      <div 
        className="relative bg-gray-900 text-white"
        style={backdropUrl ? {
          backgroundImage: `url(${backdropUrl})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        } : {}}
      >
        {backdropUrl && (
          <div className="absolute inset-0 bg-black bg-opacity-60"></div>
        )}
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Back Button */}
          <Link
            to="/"
            className="inline-flex items-center space-x-2 text-white hover:text-gray-300 mb-6"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back</span>
          </Link>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Poster */}
            <div className="lg:col-span-1">
              <img
                src={posterUrl}
                alt={displayTitle}
                className="w-full max-w-sm mx-auto rounded-lg shadow-2xl"
              />
            </div>

            {/* Details */}
            <div className="lg:col-span-2">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                {displayTitle}
              </h1>

              {/* Meta Info */}
              <div className="flex flex-wrap items-center gap-4 mb-6 text-lg">
                {vote_average > 0 && (
                  <div className="flex items-center space-x-1">
                    <Star className="w-5 h-5 fill-current text-yellow-400" />
                    <span>{formatRating(vote_average)}</span>
                  </div>
                )}
                
                {displayDate && (
                  <div className="flex items-center space-x-1">
                    <Calendar className="w-5 h-5" />
                    <span>{new Date(displayDate).getFullYear()}</span>
                  </div>
                )}
                
                {displayRuntime && (
                  <div className="flex items-center space-x-1">
                    <Clock className="w-5 h-5" />
                    <span>{formatRuntime(displayRuntime)}</span>
                  </div>
                )}
              </div>

              {/* Genres */}
              {genres && genres.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-6">
                  {genres.map((genre) => (
                    <span
                      key={genre.id}
                      className="px-3 py-1 bg-white bg-opacity-20 rounded-full text-sm"
                    >
                      {genre.name}
                    </span>
                  ))}
                </div>
              )}

              {/* Overview */}
              {overview && (
                <p className="text-lg leading-relaxed mb-6">
                  {overview}
                </p>
              )}

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-4">
                <button
                  onClick={handleWatchlistToggle}
                  className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-medium transition-colors ${
                    inWatchlist
                      ? 'bg-red-600 hover:bg-red-700 text-white'
                      : 'bg-white bg-opacity-20 hover:bg-opacity-30 text-white'
                  }`}
                >
                  <Heart className={`w-5 h-5 ${inWatchlist ? 'fill-current' : ''}`} />
                  <span>{inWatchlist ? 'Remove from Watchlist' : 'Add to Watchlist'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Similar Content */}
      {similar.length > 0 && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-8">
            Similar {isMovie ? 'Movies' : 'TV Shows'}
          </h2>
          <MovieGrid
            items={similar.map(item => ({ ...item, media_type: mediaType }))}
            emptyMessage={`No similar ${isMovie ? 'movies' : 'TV shows'} found.`}
          />
        </div>
      )}
    </div>
  )
}

export default MovieDetailsPage
