# 🎬 Movie Box

A modern, responsive web application for discovering movies and TV shows, built with React and powered by TMDB and OMDB APIs.

![Movie Box](https://img.shields.io/badge/React-18.2.0-blue)
![Vite](https://img.shields.io/badge/Vite-5.0.0-purple)
![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-3.3.6-cyan)
![License](https://img.shields.io/badge/License-MIT-green)

## ✨ Features

### 🎯 Core Features
- **Movie & TV Show Discovery**: Browse trending, popular, and top-rated content
- **Advanced Search**: Search across movies, TV shows, and people
- **Detailed Information**: View comprehensive details including cast, crew, ratings, and reviews
- **Personal Watchlist**: Save movies and TV shows to your personal watchlist
- **Responsive Design**: Optimized for desktop, tablet, and mobile devices
- **Dark/Light Theme**: Toggle between dark and light modes

### 🔍 Search & Discovery
- Multi-category search (movies, TV shows, people)
- Real-time search suggestions
- Filter by genre, release date, and ratings
- Trending content discovery
- Popular and top-rated collections

### 📱 User Experience
- Fast loading with intelligent caching
- Smooth animations and transitions
- Error handling and loading states
- Offline-friendly design
- Accessibility features

## 🛠️ Technology Stack

### Frontend Framework
- **React 18.2.0** - Modern React with hooks and context
- **React Router DOM 6.20.1** - Client-side routing
- **Vite 5.0.0** - Fast build tool and development server

### Styling & UI
- **Tailwind CSS 3.3.6** - Utility-first CSS framework
- **Lucide React 0.294.0** - Beautiful SVG icons
- **PostCSS 8.4.32** - CSS processing
- **Autoprefixer 10.4.16** - CSS vendor prefixing

### API Integration
- **Axios 1.6.2** - HTTP client for API requests
- **TMDB API** - The Movie Database for comprehensive movie/TV data
- **OMDB API** - Additional ratings and metadata

### Development Tools
- **ESLint 8.53.0** - Code linting and formatting
- **TypeScript Types** - Type definitions for React
- **Vite Plugins** - React support and optimizations

## 📁 Project Structure

```
src/
├── components/           # Reusable UI components
│   ├── common/          # Shared components (Header, Footer, etc.)
│   ├── movie/           # Movie-specific components
│   └── watchlist/       # Watchlist-related components
├── context/             # React Context for state management
│   └── AppContext.jsx   # Global application state
├── hooks/               # Custom React hooks
│   ├── useMovies.js     # Movie data management
│   ├── useWatchlist.js  # Watchlist operations
│   └── useLocalStorage.js # Local storage utilities
├── pages/               # Page components
│   ├── HomePage.jsx     # Landing page with trending content
│   ├── SearchPage.jsx   # Search interface and results
│   ├── MovieDetailsPage.jsx # Detailed movie/TV show view
│   ├── WatchlistPage.jsx # Personal watchlist management
│   └── NotFoundPage.jsx # 404 error page
├── services/            # API service layers
│   ├── tmdbApi.js       # TMDB API integration
│   ├── omdbApi.js       # OMDB API integration
│   └── watchlistService.js # Watchlist data management
├── styles/              # Global styles and CSS
│   └── globals.css      # Global CSS with Tailwind imports
└── utils/               # Utility functions and constants
    ├── constants.js     # Application constants and configuration
    ├── helpers.js       # Helper functions
    └── cache.js         # Caching utilities
```

## 🚀 Getting Started

### Prerequisites
- **Node.js** (version 16 or higher)
- **npm** or **yarn**
- **TMDB API Key** (free from [themoviedb.org](https://www.themoviedb.org/))
- **OMDB API Key** (optional, from [omdbapi.com](https://www.omdbapi.com/))

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/kevwasonga/Movie-Box.git
   cd Movie-Box
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env` file in the root directory:
   ```env
   # TMDB API Configuration
   VITE_TMDB_API_KEY=your_tmdb_api_key_here
   VITE_TMDB_BASE_URL=https://api.themoviedb.org/3
   VITE_TMDB_IMAGE_BASE_URL=https://image.tmdb.org/t/p

   # OMDB API Configuration (Optional)
   VITE_OMDB_API_KEY=your_omdb_api_key_here
   VITE_OMDB_BASE_URL=https://www.omdbapi.com

   # App Configuration
   VITE_APP_TITLE=Movie Box
   VITE_APP_DESCRIPTION=Discover your next favorite movie or TV show
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:3000` (or the port shown in your terminal)

### Getting API Keys

#### TMDB API Key (Required)
1. Visit [The Movie Database](https://www.themoviedb.org/)
2. Create a free account
3. Go to Settings → API → Create API Key
4. Choose "Developer" and fill out the form
5. Copy your API key to the `.env` file

#### OMDB API Key (Optional)
1. Visit [OMDB API](https://www.omdbapi.com/apikey.aspx)
2. Choose the free tier (1,000 requests/day)
3. Enter your email and verify
4. Copy your API key to the `.env` file

## 📜 Available Scripts

```bash
# Development
npm run dev          # Start development server with hot reload

# Production
npm run build        # Build for production
npm run preview      # Preview production build locally

# Code Quality
npm run lint         # Run ESLint for code quality checks
```

## 🌟 Key Features Explained

### State Management
- **React Context**: Global state management for theme, watchlist, and search
- **Custom Hooks**: Reusable logic for movies, watchlist, and local storage
- **Local Storage**: Persistent storage for user preferences and watchlist

### API Integration
- **Intelligent Caching**: Reduces API calls and improves performance
- **Error Handling**: Graceful error handling with user-friendly messages
- **Rate Limiting**: Respects API rate limits with proper error handling
- **Fallback Support**: Graceful degradation when APIs are unavailable

### Performance Optimizations
- **Code Splitting**: Lazy loading of components and routes
- **Image Optimization**: Lazy loading and error handling for images
- **Caching Strategy**: Smart caching of API responses
- **Bundle Optimization**: Vite's optimized bundling and tree shaking

## 🎨 Design System

### Color Palette
- **Primary**: Blue tones for main actions and highlights
- **Secondary**: Gray tones for text and backgrounds
- **Success**: Green for positive actions
- **Warning**: Yellow for cautions
- **Error**: Red for errors and alerts

### Typography
- **Font Family**: Inter (Google Fonts)
- **Font Weights**: 300, 400, 500, 600, 700
- **Responsive Scaling**: Fluid typography across devices

### Components
- **Cards**: Consistent card design for movies and content
- **Buttons**: Multiple button variants and states
- **Forms**: Styled form inputs and controls
- **Navigation**: Responsive navigation with mobile support

## 🔧 Configuration

### Environment Variables
All configuration is handled through environment variables prefixed with `VITE_`:

- `VITE_TMDB_API_KEY`: Your TMDB API key
- `VITE_OMDB_API_KEY`: Your OMDB API key (optional)
- `VITE_APP_TITLE`: Application title
- `VITE_APP_DESCRIPTION`: Application description

### Build Configuration
- **Vite Config**: Optimized for React with plugin support
- **Tailwind Config**: Custom theme and utility classes
- **PostCSS Config**: Tailwind and Autoprefixer integration
- **ESLint Config**: React-specific linting rules

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [The Movie Database (TMDB)](https://www.themoviedb.org/) for comprehensive movie data
- [OMDB API](https://www.omdbapi.com/) for additional movie ratings
- [Lucide](https://lucide.dev/) for beautiful icons
- [Tailwind CSS](https://tailwindcss.com/) for the utility-first CSS framework

## 📞 Support

If you have any questions or need help, please:
- Open an issue on GitHub
- Check the documentation
- Review the FAQ section

---

**Made with ❤️ by [Kevin Wasonga](https://github.com/kevwasonga)**
