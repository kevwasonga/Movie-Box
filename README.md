# Movie Box 🎬

A modern, user-friendly movie and TV show discovery platform built with React, Vite, and Tailwind CSS. Discover trending content, search for your favorite movies and shows, and build your personal watchlist.

![Movie Box Screenshot](https://via.placeholder.com/800x400/374151/ffffff?text=Movie+Box+Screenshot)

## ✨ Features

- 🔍 **Advanced Search** - Search movies and TV shows with real-time results
- 📈 **Trending Content** - Discover weekly trending movies and TV shows
- ❤️ **Personal Watchlist** - Save your favorite content for later
- 🌙 **Dark/Light Theme** - Toggle between themes with persistence
- 📱 **Responsive Design** - Works perfectly on all devices
- 🚀 **Fast Performance** - Built with Vite for lightning-fast development
- 💾 **Offline Storage** - Watchlist persists locally without login
- 📊 **Detailed Information** - Comprehensive movie/TV show details
- 🎨 **Modern UI** - Clean, intuitive interface with Tailwind CSS

## 🚀 Quick Start

### Prerequisites

- **Node.js** (version 16.0 or higher)
- **npm** or **yarn** package manager
- **Git** for version control

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/kevwasonga/Movie-Box.git
   cd Movie-Box
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```

4. **Configure API keys** (see [API Setup](#-api-setup) section)

5. **Start the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

6. **Open your browser**
   Navigate to `http://localhost:3000`

## 🔑 API Setup

This project uses two APIs for movie and TV show data:

### TMDB API (Required)

1. **Create a TMDB account**
   - Go to [https://www.themoviedb.org/](https://www.themoviedb.org/)
   - Sign up for a free account

2. **Get your API key**
   - Go to [https://www.themoviedb.org/settings/api](https://www.themoviedb.org/settings/api)
   - Request an API key (it's free!)
   - Copy your API key

3. **Add to .env file**
   ```env
   VITE_TMDB_API_KEY=your_actual_tmdb_api_key_here
   ```

### OMDB API (Optional)

1. **Get OMDB API key**
   - Go to [http://www.omdbapi.com/apikey.aspx](http://www.omdbapi.com/apikey.aspx)
   - Request a free API key

2. **Add to .env file**
   ```env
   VITE_OMDB_API_KEY=your_actual_omdb_api_key_here
   ```

### Complete .env Example

```env
# TMDB API Configuration (Required)
VITE_TMDB_API_KEY=your_actual_tmdb_api_key_here
VITE_TMDB_BASE_URL=https://api.themoviedb.org/3

# OMDB API Configuration (Optional)
VITE_OMDB_API_KEY=your_actual_omdb_api_key_here
VITE_OMDB_BASE_URL=https://www.omdbapi.com

# App Configuration
VITE_APP_TITLE=Movie Box
VITE_APP_DESCRIPTION=Discover your next favorite movie or TV show

# Image Configuration
VITE_TMDB_IMAGE_BASE_URL=https://image.tmdb.org/t/p
```

## 📁 Project Structure

```
Movie-Box/
├── public/                 # Static assets
├── src/
│   ├── components/         # React components
│   │   ├── common/        # Shared components
│   │   ├── movie/         # Movie-specific components
│   │   ├── watchlist/     # Watchlist components
│   │   └── filters/       # Filter components
│   ├── pages/             # Page components
│   ├── services/          # API services
│   ├── hooks/             # Custom React hooks
│   ├── context/           # React context providers
│   ├── utils/             # Utility functions
│   ├── styles/            # Global styles
│   ├── App.jsx            # Main App component
│   └── main.jsx           # React entry point
├── .env.example           # Environment variables template
├── .gitignore            # Git ignore rules
├── dev.txt               # Development documentation
├── package.json          # Dependencies and scripts
├── tailwind.config.js    # Tailwind CSS configuration
├── vite.config.js        # Vite configuration
└── README.md             # This file
```

## 🛠️ Available Scripts

```bash
# Development
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint

# Git workflow (feature branches)
git checkout -b feature/your-feature-name
git add specific-files
git commit -m "feat: your feature description"
git push -u origin feature/your-feature-name
```

## 🌿 Git Workflow

This project follows a feature branch workflow:

### Branch Structure
- `main` - Production-ready code (protected)
- `feature/*` - Individual features
- `hotfix/*` - Critical fixes

### Feature Development
1. **Create a feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Add specific files only**
   ```bash
   # Don't use 'git add .'
   git add src/components/YourComponent.jsx
   git add src/pages/YourPage.jsx
   ```

3. **Commit with conventional format**
   ```bash
   git commit -m "feat(component): add new movie card component

   - Add MovieCard component with poster display
   - Include rating and watchlist functionality
   - Add responsive design for mobile devices"
   ```

4. **Push feature branch**
   ```bash
   git push -u origin feature/your-feature-name
   ```

### Existing Feature Branches
- `feature/project-setup` - Initial project configuration
- `feature/core-utilities` - Utility functions and constants
- `feature/api-services` - API integration services
- `feature/state-management` - React context and hooks
- `feature/ui-components` - Common UI components
- `feature/movie-components` - Movie-specific components
- `feature/watchlist-components` - Watchlist functionality
- `feature/pages` - Main application pages
- `feature/app-routing` - App routing and layout

## 🧪 Testing

```bash
# Run tests (when implemented)
npm test

# Run tests in watch mode
npm run test:watch

# Generate coverage report
npm run test:coverage
```

## 🚀 Deployment

### Vercel (Recommended)
1. **Connect your GitHub repository**
2. **Set environment variables** in Vercel dashboard
3. **Deploy automatically** on push to main

### Netlify
1. **Connect your GitHub repository**
2. **Build command:** `npm run build`
3. **Publish directory:** `dist`
4. **Set environment variables** in Netlify dashboard

### Manual Build
```bash
npm run build
# Upload 'dist' folder to your hosting provider
```

## 🔧 Configuration

### Tailwind CSS
- Configuration: `tailwind.config.js`
- Custom theme with dark mode support
- Responsive breakpoints and custom utilities

### Vite
- Configuration: `vite.config.js`
- Hot module replacement enabled
- Optimized for development and production

### ESLint
- React-specific rules enabled
- Consistent code formatting
- Error prevention and best practices

## 📚 Key Dependencies

### Core
- **React 18** - UI library
- **Vite** - Build tool and dev server
- **React Router DOM** - Client-side routing

### Styling
- **Tailwind CSS** - Utility-first CSS framework
- **Lucide React** - Beautiful icons

### HTTP & State
- **Axios** - HTTP client for API requests
- **React Context** - State management

### Development
- **ESLint** - Code linting
- **PostCSS** - CSS processing
- **Autoprefixer** - CSS vendor prefixes

## 🐛 Troubleshooting

### Common Issues

1. **API Key Errors**
   ```
   Error: Invalid API key. Please check your configuration.
   ```
   - Verify your TMDB API key in `.env`
   - Ensure the key is active and valid
   - Restart the development server after adding keys

2. **Module Not Found**
   ```
   Error: Cannot resolve module
   ```
   - Run `npm install` to ensure all dependencies are installed
   - Clear node_modules and reinstall: `rm -rf node_modules && npm install`

3. **Port Already in Use**
   ```
   Error: Port 3000 is already in use
   ```
   - Kill the process: `lsof -ti:3000 | xargs kill -9`
   - Or use a different port: `npm run dev -- --port 3001`

4. **Build Errors**
   - Check for TypeScript errors: `npm run lint`
   - Ensure all imports are correct
   - Verify environment variables are set

### Getting Help

1. **Check the dev.txt file** for detailed development notes
2. **Review the console** for specific error messages
3. **Check the Network tab** for API request failures
4. **Verify environment variables** are properly set

## 🤝 Contributing

1. **Fork the repository**
2. **Create a feature branch** (`git checkout -b feature/amazing-feature`)
3. **Make your changes** following the project structure
4. **Add specific files** (`git add src/components/YourComponent.jsx`)
5. **Commit your changes** (`git commit -m 'feat: add amazing feature'`)
6. **Push to the branch** (`git push origin feature/amazing-feature`)
7. **Open a Pull Request**

### Code Style
- Use functional components with hooks
- Follow the existing file structure
- Add proper TypeScript types when applicable
- Include responsive design considerations
- Test on both light and dark themes

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **TMDB** for providing comprehensive movie and TV data
- **OMDB** for additional movie ratings and information
- **React Team** for the amazing framework
- **Tailwind CSS** for the utility-first CSS framework
- **Vite** for the lightning-fast build tool

---

**Happy coding! 🚀**

For detailed development notes and technical specifications, see [dev.txt](dev.txt).
