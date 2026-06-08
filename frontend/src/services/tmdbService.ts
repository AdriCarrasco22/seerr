import client from "./tmdb"
import type { Movie, Serie, MediaItem, TMDBResponse, VideoResponse } from "../types/tmdb"
import type { AxiosResponse } from "axios"

export const getTrending = (page = 1): Promise<AxiosResponse<TMDBResponse<MediaItem>>> =>
  client.get("/trending/all/week", { params: { page } })

export const getPopularMovies = (page = 1): Promise<AxiosResponse<TMDBResponse<Movie>>> =>
  client.get("/movie/popular", { params: { page } })

export const getPopularSeries = (page = 1): Promise<AxiosResponse<TMDBResponse<Serie>>> =>
  client.get("/tv/popular", { params: { page } })

export const searchContent = (query: string, page = 1): Promise<AxiosResponse<TMDBResponse<MediaItem>>> =>
  client.get("/search/multi", { params: { query, page } })

export const getMovieDetail = (id: number | string): Promise<AxiosResponse<Movie>> =>
  client.get(`/movie/${id}`, { params: { append_to_response: "credits" } })

export const getSerieDetail = (id: number | string): Promise<AxiosResponse<Serie>> =>
  client.get(`/tv/${id}`, { params: { append_to_response: "credits" } })

export const getMovieVideos = (id: number | string): Promise<AxiosResponse<VideoResponse>> =>
  client.get(`/movie/${id}/videos`)

export const getSerieVideos = (id: number | string): Promise<AxiosResponse<VideoResponse>> =>
  client.get(`/tv/${id}/videos`)

export interface Genre {
  id: number
  name: string
}

export interface GenreResponse {
  genres: Genre[]
}

export const getMovieGenres = (): Promise<AxiosResponse<GenreResponse>> =>
  client.get('/genre/movie/list')

export const getSerieGenres = (): Promise<AxiosResponse<GenreResponse>> =>
  client.get('/genre/tv/list')

export const getMoviesByGenre = (genreId: number, page = 1): Promise<AxiosResponse<TMDBResponse<Movie>>> =>
  client.get('/discover/movie', { params: { with_genres: genreId, page } })

export const getSeriesByGenre = (genreId: number, page = 1): Promise<AxiosResponse<TMDBResponse<Serie>>> =>
  client.get('/discover/tv', { params: { with_genres: genreId, page } })