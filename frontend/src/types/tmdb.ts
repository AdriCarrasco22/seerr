export interface Movie {
  id: number
  title: string
  overview: string
  poster_path: string | null
  backdrop_path: string | null
  release_date: string
  vote_average: number
  genre_ids: number[]
  media_type?: 'movie'
}

export interface Serie {
  id: number
  name: string
  overview: string
  poster_path: string | null
  backdrop_path: string | null
  first_air_date: string
  vote_average: number
  genre_ids: number[]
  media_type?: 'tv'
}

export type MediaItem = Movie | Serie

export interface TMDBResponse<T> {
  page: number
  results: T[]
  total_pages: number
  total_results: number
}

export interface Video {
  id: string
  key: string        // este es el ID de YouTube, ej: "dQw4w9WgXcQ"
  name: string
  site: string       // "YouTube", "Vimeo", etc.
  type: string       // "Trailer", "Teaser", "Clip", etc.
  official: boolean
}

export interface VideoResponse {
  id: number
  results: Video[]
}