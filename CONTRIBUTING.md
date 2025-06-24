# Contributing to Movie Box 🎬

Thank you for your interest in contributing to Movie Box! This document provides detailed guidelines for developers who want to contribute to the project.

## 📋 Table of Contents

- [Getting Started](#getting-started)
- [Development Workflow](#development-workflow)
- [Code Standards](#code-standards)
- [Component Guidelines](#component-guidelines)
- [Testing Guidelines](#testing-guidelines)
- [Pull Request Process](#pull-request-process)
- [Issue Reporting](#issue-reporting)

## 🚀 Getting Started

### Prerequisites

Before you begin, ensure you have:
- Node.js (v16.0 or higher)
- npm or yarn package manager
- Git
- A code editor (VS Code recommended)
- TMDB API key (free from themoviedb.org)

### Development Setup

1. **Fork and clone the repository**
   ```bash
   git clone https://github.com/your-username/Movie-Box.git
   cd Movie-Box
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   # Add your TMDB API key to .env
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

## 🌿 Development Workflow

### Branch Strategy

We use a feature branch workflow. **Never commit directly to main.**

1. **Create a feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Branch naming conventions**
   - `feature/` - New features
   - `fix/` - Bug fixes
   - `docs/` - Documentation updates
   - `refactor/` - Code refactoring
   - `style/` - UI/styling changes

### Commit Guidelines

Follow conventional commit format:

```bash
git commit -m "type(scope): description

- Detailed explanation of changes
- Why the change was made
- Any breaking changes"
```

**Types:**
- `feat` - New feature
- `fix` - Bug fix
- `docs` - Documentation
- `style` - Formatting, missing semicolons, etc.
- `refactor` - Code change that neither fixes a bug nor adds a feature
- `test` - Adding missing tests
- `chore` - Updating build tasks, package manager configs, etc.

**Examples:**
```bash
git commit -m "feat(search): add debounced search functionality

- Implement 500ms debounce for search input
- Reduce API calls and improve performance
- Add loading state during search"

git commit -m "fix(watchlist): resolve duplicate items issue

- Check for existing items before adding to watchlist
- Add proper error handling for duplicate entries"
```

### File Management

**Add specific files only - never use `git add .`**

```bash
# Good
git add src/components/SearchBar.jsx
git add src/hooks/useSearch.js

# Bad
git add .
```

## 📝 Code Standards

### JavaScript/React

1. **Use functional components with hooks**
   ```jsx
   // Good
   const MovieCard = ({ movie }) => {
     const [loading, setLoading] = useState(false)
     // ...
   }

   // Avoid
   class MovieCard extends Component {
     // ...
   }
   ```

2. **Destructure props and state**
   ```jsx
   // Good
   const MovieCard = ({ title, poster, rating }) => {
     // ...
   }

   // Avoid
   const MovieCard = (props) => {
     return <div>{props.title}</div>
   }
   ```

3. **Use meaningful variable names**
   ```jsx
   // Good
   const [searchResults, setSearchResults] = useState([])
   const [isLoading, setIsLoading] = useState(false)

   // Avoid
   const [data, setData] = useState([])
   const [flag, setFlag] = useState(false)
   ```

### File Structure

1. **Component file structure**
   ```jsx
   import React, { useState, useEffect } from 'react'
   import { Link } from 'react-router-dom'
   import { Heart, Star } from 'lucide-react'
   import { useApp } from '../../context/AppContext'
   import { formatRating } from '../../utils/helpers'

   const ComponentName = ({ prop1, prop2 }) => {
     // State
     const [localState, setLocalState] = useState(null)
     
     // Context
     const { globalState, globalAction } = useApp()
     
     // Effects
     useEffect(() => {
       // Effect logic
     }, [])
     
     // Handlers
     const handleClick = () => {
       // Handler logic
     }
     
     // Render
     return (
       <div className="component-container">
         {/* JSX */}
       </div>
     )
   }

   export default ComponentName
   ```

2. **Import order**
   ```jsx
   // 1. React and React-related
   import React, { useState, useEffect } from 'react'
   import { Link, useNavigate } from 'react-router-dom'
   
   // 2. Third-party libraries
   import { Heart, Star } from 'lucide-react'
   
   // 3. Internal components
   import MovieCard from '../movie/MovieCard'
   import LoadingSpinner from '../common/LoadingSpinner'
   
   // 4. Hooks and context
   import { useApp } from '../../context/AppContext'
   import { useMovies } from '../../hooks/useMovies'
   
   // 5. Services and utilities
   import tmdbApi from '../../services/tmdbApi'
   import { formatDate, getImageUrl } from '../../utils/helpers'
   ```

### CSS/Styling

1. **Use Tailwind CSS classes**
   ```jsx
   // Good
   <div className="flex items-center space-x-2 p-4 bg-white dark:bg-dark-800 rounded-lg">
   
   // Avoid custom CSS when Tailwind classes exist
   <div style={{ display: 'flex', padding: '16px' }}>
   ```

2. **Responsive design**
   ```jsx
   // Always consider mobile-first
   <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
   ```

3. **Dark mode support**
   ```jsx
   // Include dark mode variants
   <div className="bg-white dark:bg-dark-800 text-gray-900 dark:text-gray-100">
   ```

## 🧩 Component Guidelines

### Component Structure

1. **Keep components focused and small**
   - Single responsibility principle
   - Maximum 200 lines per component
   - Extract complex logic into custom hooks

2. **Props interface**
   ```jsx
   const MovieCard = ({ 
     movie,
     showWatchlistButton = true,
     onCardClick,
     className = ''
   }) => {
     // Component logic
   }
   ```

3. **Error boundaries**
   ```jsx
   // Handle errors gracefully
   if (error) {
     return <ErrorMessage error={error} onRetry={handleRetry} />
   }

   if (loading) {
     return <LoadingSpinner />
   }
   ```

### Custom Hooks

1. **Extract reusable logic**
   ```jsx
   // Good - Custom hook
   const useMovieSearch = () => {
     const [results, setResults] = useState([])
     const [loading, setLoading] = useState(false)
     
     const search = useCallback(async (query) => {
       // Search logic
     }, [])
     
     return { results, loading, search }
   }
   ```

2. **Hook naming**
   - Start with `use`
   - Descriptive names: `useMovieSearch`, `useWatchlist`, `useLocalStorage`

## 🧪 Testing Guidelines

### Component Testing

```jsx
// Example test structure
import { render, screen, fireEvent } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import { AppProvider } from '../../context/AppContext'
import MovieCard from './MovieCard'

const renderWithProviders = (component) => {
  return render(
    <BrowserRouter>
      <AppProvider>
        {component}
      </AppProvider>
    </BrowserRouter>
  )
}

describe('MovieCard', () => {
  const mockMovie = {
    id: 1,
    title: 'Test Movie',
    vote_average: 8.5,
    poster_path: '/test.jpg'
  }

  test('renders movie title', () => {
    renderWithProviders(<MovieCard movie={mockMovie} />)
    expect(screen.getByText('Test Movie')).toBeInTheDocument()
  })

  test('handles watchlist toggle', () => {
    renderWithProviders(<MovieCard movie={mockMovie} />)
    const watchlistButton = screen.getByLabelText(/add to watchlist/i)
    fireEvent.click(watchlistButton)
    // Assert expected behavior
  })
})
```

### API Testing

```jsx
// Mock API responses
jest.mock('../../services/tmdbApi', () => ({
  movie: {
    search: jest.fn(() => Promise.resolve({
      results: [mockMovie],
      total_results: 1
    }))
  }
}))
```

## 🔄 Pull Request Process

### Before Submitting

1. **Test your changes**
   ```bash
   npm run lint
   npm test
   npm run build
   ```

2. **Update documentation**
   - Update README.md if needed
   - Add JSDoc comments for new functions
   - Update dev.txt with technical notes

3. **Check responsive design**
   - Test on mobile, tablet, and desktop
   - Verify dark/light theme compatibility

### PR Template

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
- [ ] Tested on Chrome/Firefox/Safari
- [ ] Tested on mobile devices
- [ ] Tested dark/light themes
- [ ] Added/updated tests

## Screenshots
Include screenshots for UI changes

## Checklist
- [ ] Code follows project style guidelines
- [ ] Self-review completed
- [ ] Documentation updated
- [ ] No console errors
```

## 🐛 Issue Reporting

### Bug Reports

```markdown
**Bug Description**
Clear description of the bug

**Steps to Reproduce**
1. Go to '...'
2. Click on '...'
3. See error

**Expected Behavior**
What should happen

**Screenshots**
If applicable

**Environment**
- OS: [e.g. macOS, Windows]
- Browser: [e.g. Chrome, Firefox]
- Version: [e.g. 1.0.0]
```

### Feature Requests

```markdown
**Feature Description**
Clear description of the feature

**Use Case**
Why is this feature needed?

**Proposed Solution**
How should it work?

**Alternatives**
Other solutions considered
```

## 📚 Resources

### Documentation
- [React Documentation](https://reactjs.org/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Vite Documentation](https://vitejs.dev/guide)
- [TMDB API Documentation](https://developers.themoviedb.org/3)

### Tools
- [React Developer Tools](https://chrome.google.com/webstore/detail/react-developer-tools)
- [Tailwind CSS IntelliSense](https://marketplace.visualstudio.com/items?itemName=bradlc.vscode-tailwindcss)

## 🤝 Community

- Be respectful and inclusive
- Help others learn and grow
- Share knowledge and best practices
- Follow the code of conduct

Thank you for contributing to Movie Box! 🎬
