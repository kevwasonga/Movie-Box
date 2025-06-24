import React from 'react'
import { AlertCircle, RefreshCw, Home } from 'lucide-react'
import { Link } from 'react-router-dom'

const ErrorMessage = ({ 
  error, 
  onRetry, 
  showHomeLink = false,
  className = '' 
}) => {
  const getErrorMessage = (error) => {
    if (typeof error === 'string') return error
    if (error?.message) return error.message
    return 'An unexpected error occurred'
  }

  const getErrorTitle = (error) => {
    const message = getErrorMessage(error)
    
    if (message.includes('Network')) return 'Network Error'
    if (message.includes('rate limit')) return 'Rate Limit Exceeded'
    if (message.includes('not found')) return 'Not Found'
    if (message.includes('API key')) return 'Configuration Error'
    
    return 'Error'
  }

  return (
    <div className={`flex flex-col items-center justify-center p-8 text-center ${className}`}>
      <div className="bg-red-50 dark:bg-red-900/20 rounded-full p-4 mb-4">
        <AlertCircle className="w-12 h-12 text-red-500 dark:text-red-400" />
      </div>
      
      <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
        {getErrorTitle(error)}
      </h3>
      
      <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md">
        {getErrorMessage(error)}
      </p>
      
      <div className="flex flex-col sm:flex-row gap-3">
        {onRetry && (
          <button
            onClick={onRetry}
            className="btn-primary flex items-center space-x-2"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Try Again</span>
          </button>
        )}
        
        {showHomeLink && (
          <Link
            to="/"
            className="btn-secondary flex items-center space-x-2"
          >
            <Home className="w-4 h-4" />
            <span>Go Home</span>
          </Link>
        )}
      </div>
    </div>
  )
}

export default ErrorMessage
