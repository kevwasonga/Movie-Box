import React, { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { Search, Menu, X, Sun, Moon, Heart, Home, Film } from 'lucide-react'
import { useApp } from '../../context/AppContext'
import { APP_TITLE } from '../../utils/constants'

const Header = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { theme, toggleTheme, watchlist, searchQuery, setSearchQuery } = useApp()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [searchInput, setSearchInput] = useState(searchQuery)

  const handleSearch = (e) => {
    e.preventDefault()
    if (searchInput.trim()) {
      setSearchQuery(searchInput.trim())
      navigate(`/search?q=${encodeURIComponent(searchInput.trim())}`)
      setIsMenuOpen(false)
    }
  }

  const handleSearchInputChange = (e) => {
    setSearchInput(e.target.value)
  }

  const isActive = (path) => {
    return location.pathname === path
  }

  const navItems = [
    { path: '/', label: 'Home', icon: Home },
    { path: '/watchlist', label: 'Watchlist', icon: Heart, badge: watchlist.length },
  ]

  return (
    <header className="bg-white dark:bg-dark-800 shadow-md sticky top-0 z-50 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link 
            to="/" 
            className="flex items-center space-x-2 text-xl font-bold text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 transition-colors"
          >
            <Film className="w-8 h-8" />
            <span className="hidden sm:block">{APP_TITLE}</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navItems.map(({ path, label, icon: Icon, badge }) => (
              <Link
                key={path}
                to={path}
                className={`flex items-center space-x-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive(path)
                    ? 'bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300'
                    : 'text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-gray-100 dark:hover:bg-dark-700'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{label}</span>
                {badge > 0 && (
                  <span className="bg-primary-600 text-white text-xs rounded-full px-2 py-0.5 min-w-[1.25rem] text-center">
                    {badge}
                  </span>
                )}
              </Link>
            ))}
          </nav>

          {/* Search Bar - Desktop */}
          <form onSubmit={handleSearch} className="hidden md:flex items-center flex-1 max-w-md mx-8">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                value={searchInput}
                onChange={handleSearchInputChange}
                placeholder="Search movies and TV shows..."
                className="input-field pl-10 pr-4 py-2 w-full"
              />
            </div>
          </form>

          {/* Theme Toggle & Mobile Menu Button */}
          <div className="flex items-center space-x-2">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-dark-700 transition-colors"
              aria-label="Toggle theme"
            >
              {theme === 'light' ? (
                <Moon className="w-5 h-5" />
              ) : (
                <Sun className="w-5 h-5" />
              )}
            </button>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-dark-700 transition-colors"
              aria-label="Toggle menu"
            >
              {isMenuOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-gray-200 dark:border-dark-700 py-4 space-y-4">
            {/* Mobile Search */}
            <form onSubmit={handleSearch} className="px-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  value={searchInput}
                  onChange={handleSearchInputChange}
                  placeholder="Search movies and TV shows..."
                  className="input-field pl-10 pr-4 py-2 w-full"
                />
              </div>
            </form>

            {/* Mobile Navigation */}
            <nav className="space-y-2 px-2">
              {navItems.map(({ path, label, icon: Icon, badge }) => (
                <Link
                  key={path}
                  to={path}
                  onClick={() => setIsMenuOpen(false)}
                  className={`flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive(path)
                      ? 'bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300'
                      : 'text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-gray-100 dark:hover:bg-dark-700'
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    <Icon className="w-4 h-4" />
                    <span>{label}</span>
                  </div>
                  {badge > 0 && (
                    <span className="bg-primary-600 text-white text-xs rounded-full px-2 py-0.5 min-w-[1.25rem] text-center">
                      {badge}
                    </span>
                  )}
                </Link>
              ))}
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}

export default Header
