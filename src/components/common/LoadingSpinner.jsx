import React from 'react'
import { Loader2 } from 'lucide-react'

const LoadingSpinner = ({ 
  size = 'medium', 
  text = 'Loading...', 
  fullScreen = false,
  className = '' 
}) => {
  const sizeClasses = {
    small: 'w-4 h-4',
    medium: 'w-8 h-8',
    large: 'w-12 h-12',
    xlarge: 'w-16 h-16'
  }

  const textSizeClasses = {
    small: 'text-sm',
    medium: 'text-base',
    large: 'text-lg',
    xlarge: 'text-xl'
  }

  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-white dark:bg-dark-900 bg-opacity-80 dark:bg-opacity-80 flex items-center justify-center z-50">
        <div className="flex flex-col items-center space-y-4">
          <Loader2 className={`${sizeClasses.large} text-primary-600 animate-spin`} />
          <p className={`${textSizeClasses.large} text-gray-700 dark:text-gray-300 font-medium`}>
            {text}
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className={`flex items-center justify-center space-x-2 ${className}`}>
      <Loader2 className={`${sizeClasses[size]} text-primary-600 animate-spin`} />
      {text && (
        <span className={`${textSizeClasses[size]} text-gray-700 dark:text-gray-300`}>
          {text}
        </span>
      )}
    </div>
  )
}

export default LoadingSpinner
