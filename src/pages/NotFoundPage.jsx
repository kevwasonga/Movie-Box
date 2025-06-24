import React from 'react'
import { Link } from 'react-router-dom'
import { Home, Search, ArrowLeft } from 'lucide-react'

const NotFoundPage = () => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-dark-900 flex items-center justify-center">
      <div className="max-w-md mx-auto text-center px-4">
        {/* 404 Illustration */}
        <div className="mb-8">
          <div className="text-9xl font-bold text-gray-300 dark:text-dark-600 mb-4">
            404
          </div>
          <div className="text-6xl mb-4">🎬</div>
        </div>

        {/* Error Message */}
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4">
          Page Not Found
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mb-8">
          Sorry, the page you're looking for doesn't exist. It might have been moved, deleted, or you entered the wrong URL.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/"
            className="btn-primary flex items-center justify-center space-x-2"
          >
            <Home className="w-4 h-4" />
            <span>Go Home</span>
          </Link>
          
          <Link
            to="/search"
            className="btn-secondary flex items-center justify-center space-x-2"
          >
            <Search className="w-4 h-4" />
            <span>Search Movies</span>
          </Link>
          
          <button
            onClick={() => window.history.back()}
            className="btn-secondary flex items-center justify-center space-x-2"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Go Back</span>
          </button>
        </div>

        {/* Additional Help */}
        <div className="mt-12 text-sm text-gray-500 dark:text-gray-400">
          <p>If you think this is an error, please try refreshing the page or contact support.</p>
        </div>
      </div>
    </div>
  )
}

export default NotFoundPage
