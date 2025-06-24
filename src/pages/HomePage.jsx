import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { TrendingUp, Film, Tv, ChevronRight } from 'lucide-react'
import MovieGrid from '../components/movie/MovieGrid'
import MovieCard from '../components/movie/MovieCard'
import LoadingSpinner from '../components/common/LoadingSpinner'
import ErrorMessage from '../components/common/ErrorMessage'
import apiService from '../services/apiService'
import { useApp } from '../context/AppContext'

const HomePage = () => {
  const { setLoading, setError } = useApp()
  const [trendingMovies, setTrendingMovies] = useState([])
  const [trendingTv, setTrendingTv] = useState([])
  const [popularMovies, setPopularMovies] = useState([])
  const [loadingStates, setLoadingStates] = useState({
    trending: true,
    popular: true
  })
  const [errors, setErrors] = useState({
    trending: null,
    popular: null
  })

  useEffect(() => {
    loadHomeData()
  }, [])

  const loadHomeData = async () => {
    try {
      // Load trending content
      await loadTrendingContent()
      
      // Load popular movies
      await loadPopularMovies()
    } catch (error) {
      console.error('Error loading home data:', error)
    }
  }

  const loadTrendingContent = async () => {
    try {
      setLoadingStates(prev => ({ ...prev, trending: true }))
      setErrors(prev => ({ ...prev, trending: null }))

      const [moviesResponse, tvResponse] = await Promise.all([
        apiService.movie.getTrending('week'),
        apiService.tv.getTrending('week')
      ])

      // Take first 10 items from each
      setTrendingMovies(moviesResponse.results?.slice(0, 10) || [])
      setTrendingTv(tvResponse.results?.slice(0, 10) || [])
    } catch (error) {
      console.error('Error loading trending content:', error)
      setErrors(prev => ({ ...prev, trending: error.message }))
    } finally {
      setLoadingStates(prev => ({ ...prev, trending: false }))
    }
  }

  const loadPopularMovies = async () => {
    try {
      setLoadingStates(prev => ({ ...prev, popular: true }))
      setErrors(prev => ({ ...prev, popular: null }))

      const response = await apiService.movie.getPopular(1)
      setPopularMovies(response.results?.slice(0, 12) || [])
    } catch (error) {
      console.error('Error loading popular movies:', error)
      setErrors(prev => ({ ...prev, popular: error.message }))
    } finally {
      setLoadingStates(prev => ({ ...prev, popular: false }))
    }
  }

  const retryTrending = () => {
    loadTrendingContent()
  }

  const retryPopular = () => {
    loadPopularMovies()
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-dark-900">
      {/* Demo Mode Notice */}
      {apiService.isUsingDemoMode() && (
        <div className="bg-yellow-50 dark:bg-yellow-900/20 border-l-4 border-yellow-400 p-4">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-yellow-700 dark:text-yellow-200">
                  <strong>Demo Mode:</strong> You're viewing sample data.
                  <a href="https://www.themoviedb.org/settings/api" target="_blank" rel="noopener noreferrer" className="underline ml-1">
                    Get a free TMDB API key
                  </a> and add it to your .env file for real movie data.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary-600 to-primary-800 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-4">
              Discover Amazing Movies & TV Shows
            </h1>
            <p className="text-xl md:text-2xl text-primary-100 mb-8 max-w-3xl mx-auto">
              Explore trending content, find your next favorite watch, and build your personal watchlist
            </p>
            <Link
              to="/search"
              className="inline-flex items-center space-x-2 bg-white text-primary-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
            >
              <span>Start Exploring</span>
              <ChevronRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Trending Section */}
        <section className="mb-16">
          <div className="flex items-center space-x-2 mb-8">
            <TrendingUp className="w-6 h-6 text-primary-600" />
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-gray-100">
              Trending This Week
            </h2>
          </div>

          {loadingStates.trending ? (
            <div className="flex justify-center py-12">
              <LoadingSpinner size="large" text="Loading trending content..." />
            </div>
          ) : errors.trending ? (
            <ErrorMessage 
              error={errors.trending} 
              onRetry={retryTrending}
              className="py-12"
            />
          ) : (
            <div className="space-y-8">
              {/* Trending Movies */}
              {trendingMovies.length > 0 && (
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 flex items-center space-x-2">
                      <Film className="w-5 h-5" />
                      <span>Movies</span>
                    </h3>
                    <Link
                      to="/search?type=movie"
                      className="text-primary-600 dark:text-primary-400 hover:underline text-sm font-medium"
                    >
                      View All Movies
                    </Link>
                  </div>
                  <div className="overflow-x-auto">
                    <div className="flex space-x-4 pb-4">
                      {trendingMovies.map((movie) => (
                        <div key={movie.id} className="flex-shrink-0 w-48">
                          <MovieCard item={{ ...movie, media_type: 'movie' }} />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Trending TV Shows */}
              {trendingTv.length > 0 && (
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 flex items-center space-x-2">
                      <Tv className="w-5 h-5" />
                      <span>TV Shows</span>
                    </h3>
                    <Link
                      to="/search?type=tv"
                      className="text-primary-600 dark:text-primary-400 hover:underline text-sm font-medium"
                    >
                      View All TV Shows
                    </Link>
                  </div>
                  <div className="overflow-x-auto">
                    <div className="flex space-x-4 pb-4">
                      {trendingTv.map((show) => (
                        <div key={show.id} className="flex-shrink-0 w-48">
                          <MovieCard item={{ ...show, media_type: 'tv' }} />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </section>

        {/* Popular Movies Section */}
        <section>
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-gray-100">
              Popular Movies
            </h2>
            <Link
              to="/search?type=movie&sort=popularity.desc"
              className="text-primary-600 dark:text-primary-400 hover:underline font-medium"
            >
              View All
            </Link>
          </div>

          <MovieGrid
            items={popularMovies.map(movie => ({ ...movie, media_type: 'movie' }))}
            loading={loadingStates.popular}
            error={errors.popular}
            onRetry={retryPopular}
            emptyMessage="No popular movies found."
          />
        </section>
      </div>
    </div>
  )
}

export default HomePage
