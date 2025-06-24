import React from 'react'
import { Link } from 'react-router-dom'
import { Film, Heart, Github, ExternalLink } from 'lucide-react'
import { APP_TITLE } from '../../utils/constants'

const Footer = () => {
  const currentYear = new Date().getFullYear()

  const footerLinks = [
    {
      title: 'Navigation',
      links: [
        { label: 'Home', path: '/' },
        { label: 'Search', path: '/search' },
        { label: 'Watchlist', path: '/watchlist' },
      ]
    },
    {
      title: 'Resources',
      links: [
        { 
          label: 'TMDB API', 
          path: 'https://www.themoviedb.org/documentation/api',
          external: true 
        },
        { 
          label: 'OMDB API', 
          path: 'http://www.omdbapi.com/',
          external: true 
        },
      ]
    }
  ]

  return (
    <footer className="bg-white dark:bg-dark-800 border-t border-gray-200 dark:border-dark-700 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <Film className="w-8 h-8 text-primary-600 dark:text-primary-400" />
              <span className="text-xl font-bold text-gray-900 dark:text-gray-100">
                {APP_TITLE}
              </span>
            </div>
            <p className="text-gray-600 dark:text-gray-400 mb-4 max-w-md">
              Discover your next favorite movie or TV show. Browse trending content, 
              search for specific titles, and build your personal watchlist.
            </p>
            <div className="flex items-center space-x-4">
              <a
                href="https://github.com/kevwasonga/Movie-Box"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-2 text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
              >
                <Github className="w-5 h-5" />
                <span className="text-sm">View on GitHub</span>
              </a>
            </div>
          </div>

          {/* Links Sections */}
          {footerLinks.map((section) => (
            <div key={section.title}>
              <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 uppercase tracking-wider mb-4">
                {section.title}
              </h3>
              <ul className="space-y-2">
                {section.links.map((link) => (
                  <li key={link.label}>
                    {link.external ? (
                      <a
                        href={link.path}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center space-x-1 text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors text-sm"
                      >
                        <span>{link.label}</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    ) : (
                      <Link
                        to={link.path}
                        className="text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors text-sm"
                      >
                        {link.label}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Section */}
        <div className="mt-8 pt-8 border-t border-gray-200 dark:border-dark-700">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-sm text-gray-600 dark:text-gray-400">
              © {currentYear} {APP_TITLE}. Built with{' '}
              <Heart className="w-4 h-4 inline text-red-500" />{' '}
              using React and Tailwind CSS.
            </div>
            
            <div className="flex items-center space-x-6 text-sm text-gray-600 dark:text-gray-400">
              <span>
                Powered by{' '}
                <a
                  href="https://www.themoviedb.org/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary-600 dark:text-primary-400 hover:underline"
                >
                  TMDB
                </a>
              </span>
              <span>
                Data from{' '}
                <a
                  href="http://www.omdbapi.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary-600 dark:text-primary-400 hover:underline"
                >
                  OMDB
                </a>
              </span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
