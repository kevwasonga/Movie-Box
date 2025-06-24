// Demo API service for when TMDB API key is not configured
// This provides sample data to demonstrate the app functionality

const demoMovies = [
  {
    id: 1,
    title: "The Shawshank Redemption",
    overview: "Two imprisoned men bond over a number of years, finding solace and eventual redemption through acts of common decency.",
    poster_path: null,
    backdrop_path: null,
    release_date: "1994-09-23",
    vote_average: 9.3,
    media_type: "movie",
    genre_ids: [18, 80],
    popularity: 95.5
  },
  {
    id: 2,
    title: "The Godfather",
    overview: "The aging patriarch of an organized crime dynasty transfers control of his clandestine empire to his reluctant son.",
    poster_path: null,
    backdrop_path: null,
    release_date: "1972-03-24",
    vote_average: 9.2,
    media_type: "movie",
    genre_ids: [18, 80],
    popularity: 92.1
  },
  {
    id: 3,
    title: "The Dark Knight",
    overview: "When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests.",
    poster_path: null,
    backdrop_path: null,
    release_date: "2008-07-18",
    vote_average: 9.0,
    media_type: "movie",
    genre_ids: [28, 80, 18],
    popularity: 88.7
  },
  {
    id: 4,
    title: "Pulp Fiction",
    overview: "The lives of two mob hitmen, a boxer, a gangster and his wife, and a pair of diner bandits intertwine in four tales of violence and redemption.",
    poster_path: null,
    backdrop_path: null,
    release_date: "1994-10-14",
    vote_average: 8.9,
    media_type: "movie",
    genre_ids: [80, 18],
    popularity: 85.3
  },
  {
    id: 5,
    title: "Forrest Gump",
    overview: "The presidencies of Kennedy and Johnson, the events of Vietnam, Watergate and other historical events unfold from the perspective of an Alabama man.",
    poster_path: null,
    backdrop_path: null,
    release_date: "1994-07-06",
    vote_average: 8.8,
    media_type: "movie",
    genre_ids: [35, 18, 10749],
    popularity: 82.9
  },
  {
    id: 6,
    title: "Inception",
    overview: "A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O.",
    poster_path: null,
    backdrop_path: null,
    release_date: "2010-07-16",
    vote_average: 8.8,
    media_type: "movie",
    genre_ids: [28, 878, 53],
    popularity: 89.2
  }
]

const demoTvShows = [
  {
    id: 101,
    name: "Breaking Bad",
    overview: "A high school chemistry teacher diagnosed with inoperable lung cancer turns to manufacturing and selling methamphetamine.",
    poster_path: null,
    backdrop_path: null,
    first_air_date: "2008-01-20",
    vote_average: 9.5,
    media_type: "tv",
    genre_ids: [18, 80],
    popularity: 95.8
  },
  {
    id: 102,
    name: "Game of Thrones",
    overview: "Nine noble families fight for control over the lands of Westeros, while an ancient enemy returns after being dormant for millennia.",
    poster_path: null,
    backdrop_path: null,
    first_air_date: "2011-04-17",
    vote_average: 9.3,
    media_type: "tv",
    genre_ids: [18, 10759, 10765],
    popularity: 92.4
  },
  {
    id: 103,
    name: "The Sopranos",
    overview: "New Jersey mob boss Tony Soprano deals with personal and professional issues in his home and business life.",
    poster_path: null,
    backdrop_path: null,
    first_air_date: "1999-01-10",
    vote_average: 9.2,
    media_type: "tv",
    genre_ids: [18, 80],
    popularity: 88.1
  },
  {
    id: 104,
    name: "Stranger Things",
    overview: "When a young boy disappears, his mother, a police chief and his friends must confront terrifying supernatural forces.",
    poster_path: null,
    backdrop_path: null,
    first_air_date: "2016-07-15",
    vote_average: 8.7,
    media_type: "tv",
    genre_ids: [18, 10765, 9648],
    popularity: 91.3
  },
  {
    id: 105,
    name: "The Wire",
    overview: "The Baltimore drug scene, as seen through the eyes of drug dealers and law enforcement.",
    poster_path: null,
    backdrop_path: null,
    first_air_date: "2002-06-02",
    vote_average: 9.3,
    media_type: "tv",
    genre_ids: [80, 18],
    popularity: 85.7
  }
]

const demoGenres = {
  movie: [
    { id: 28, name: 'Action' },
    { id: 12, name: 'Adventure' },
    { id: 16, name: 'Animation' },
    { id: 35, name: 'Comedy' },
    { id: 80, name: 'Crime' },
    { id: 99, name: 'Documentary' },
    { id: 18, name: 'Drama' },
    { id: 10751, name: 'Family' },
    { id: 14, name: 'Fantasy' },
    { id: 36, name: 'History' },
    { id: 27, name: 'Horror' },
    { id: 10402, name: 'Music' },
    { id: 9648, name: 'Mystery' },
    { id: 10749, name: 'Romance' },
    { id: 878, name: 'Science Fiction' },
    { id: 10770, name: 'TV Movie' },
    { id: 53, name: 'Thriller' },
    { id: 10752, name: 'War' },
    { id: 37, name: 'Western' }
  ],
  tv: [
    { id: 10759, name: 'Action & Adventure' },
    { id: 16, name: 'Animation' },
    { id: 35, name: 'Comedy' },
    { id: 80, name: 'Crime' },
    { id: 99, name: 'Documentary' },
    { id: 18, name: 'Drama' },
    { id: 10751, name: 'Family' },
    { id: 10762, name: 'Kids' },
    { id: 9648, name: 'Mystery' },
    { id: 10763, name: 'News' },
    { id: 10764, name: 'Reality' },
    { id: 10765, name: 'Sci-Fi & Fantasy' },
    { id: 10766, name: 'Soap' },
    { id: 10767, name: 'Talk' },
    { id: 10768, name: 'War & Politics' },
    { id: 37, name: 'Western' }
  ]
}

// Simulate API delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

// Demo API functions
export const demoApi = {
  movie: {
    getTrending: async () => {
      await delay(500)
      return {
        page: 1,
        total_pages: 1,
        total_results: demoMovies.length,
        results: demoMovies
      }
    },
    
    getPopular: async (page = 1) => {
      await delay(500)
      return {
        page,
        total_pages: 1,
        total_results: demoMovies.length,
        results: demoMovies
      }
    },
    
    getTopRated: async (page = 1) => {
      await delay(500)
      return {
        page,
        total_pages: 1,
        total_results: demoMovies.length,
        results: [...demoMovies].sort((a, b) => b.vote_average - a.vote_average)
      }
    },
    
    getNowPlaying: async (page = 1) => {
      await delay(500)
      return {
        page,
        total_pages: 1,
        total_results: demoMovies.length,
        results: demoMovies.slice(0, 3)
      }
    },
    
    getUpcoming: async (page = 1) => {
      await delay(500)
      return {
        page,
        total_pages: 1,
        total_results: demoMovies.length,
        results: demoMovies.slice(2, 5)
      }
    },
    
    getDetails: async (movieId) => {
      await delay(500)
      const movie = demoMovies.find(m => m.id === parseInt(movieId))
      if (!movie) throw new Error('Movie not found')
      
      return {
        ...movie,
        runtime: 142,
        genres: demoGenres.movie.filter(g => movie.genre_ids.includes(g.id)),
        credits: {
          cast: [
            { id: 1, name: "Demo Actor 1", character: "Main Character" },
            { id: 2, name: "Demo Actor 2", character: "Supporting Character" }
          ]
        },
        similar: {
          results: demoMovies.filter(m => m.id !== movie.id).slice(0, 6)
        }
      }
    },
    
    search: async (query, page = 1) => {
      await delay(500)
      const filteredResults = demoMovies.filter(movie => 
        movie.title.toLowerCase().includes(query.toLowerCase()) ||
        movie.overview.toLowerCase().includes(query.toLowerCase())
      )
      
      return {
        page,
        total_pages: 1,
        total_results: filteredResults.length,
        results: filteredResults
      }
    },
    
    getSimilar: async (movieId, page = 1) => {
      await delay(500)
      return {
        page,
        total_pages: 1,
        total_results: demoMovies.length - 1,
        results: demoMovies.filter(m => m.id !== parseInt(movieId)).slice(0, 6)
      }
    }
  },
  
  tv: {
    getTrending: async () => {
      await delay(500)
      return {
        page: 1,
        total_pages: 1,
        total_results: demoTvShows.length,
        results: demoTvShows
      }
    },
    
    getPopular: async (page = 1) => {
      await delay(500)
      return {
        page,
        total_pages: 1,
        total_results: demoTvShows.length,
        results: demoTvShows
      }
    },
    
    getDetails: async (tvId) => {
      await delay(500)
      const show = demoTvShows.find(s => s.id === parseInt(tvId))
      if (!show) throw new Error('TV show not found')
      
      return {
        ...show,
        episode_run_time: [47],
        genres: demoGenres.tv.filter(g => show.genre_ids.includes(g.id)),
        credits: {
          cast: [
            { id: 1, name: "Demo Actor 1", character: "Main Character" },
            { id: 2, name: "Demo Actor 2", character: "Supporting Character" }
          ]
        },
        similar: {
          results: demoTvShows.filter(s => s.id !== show.id).slice(0, 6)
        }
      }
    },
    
    search: async (query, page = 1) => {
      await delay(500)
      const filteredResults = demoTvShows.filter(show => 
        show.name.toLowerCase().includes(query.toLowerCase()) ||
        show.overview.toLowerCase().includes(query.toLowerCase())
      )
      
      return {
        page,
        total_pages: 1,
        total_results: filteredResults.length,
        results: filteredResults
      }
    }
  },
  
  general: {
    multiSearch: async (query, page = 1) => {
      await delay(500)
      const allContent = [...demoMovies, ...demoTvShows]
      const filteredResults = allContent.filter(item => 
        (item.title || item.name).toLowerCase().includes(query.toLowerCase()) ||
        item.overview.toLowerCase().includes(query.toLowerCase())
      )
      
      return {
        page,
        total_pages: 1,
        total_results: filteredResults.length,
        results: filteredResults
      }
    },
    
    getMovieGenres: async () => {
      await delay(300)
      return { genres: demoGenres.movie }
    },
    
    getTvGenres: async () => {
      await delay(300)
      return { genres: demoGenres.tv }
    },
    
    getTrendingAll: async () => {
      await delay(500)
      const allContent = [...demoMovies.slice(0, 3), ...demoTvShows.slice(0, 3)]
      return {
        page: 1,
        total_pages: 1,
        total_results: allContent.length,
        results: allContent
      }
    }
  }
}

export default demoApi
