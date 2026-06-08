import { useState, useEffect, useCallback } from 'react'
import MediaCard from '../components/MediaCard'
import GenreFilter from '../components/GenreFilter'
import LoadMoreButton from '../components/LoadMoreButton'
import usePagination from '../hooks/usePagination'
import { useModal } from '../context/ModalContext'
import {
  getPopularMovies,
  getMoviesByGenre,
  getMovieGenres,
  type Genre,
} from '../services/tmdbService'
import type { Movie } from '../types/tmdb'

function Movies() {
  const [genres, setGenres] = useState<Genre[]>([])
  const [selectedGenre, setSelectedGenre] = useState<number | null>(null)
  const { openModal } = useModal()

  useEffect(() => {
    getMovieGenres().then((res) => setGenres(res.data.genres))
  }, [])

  const fetchFn = useCallback(
    (page: number) =>
      selectedGenre
        ? getMoviesByGenre(selectedGenre, page)
        : getPopularMovies(page),
    [selectedGenre]
  )

  const { data, loading, loadingMore, hasMore, loadMore } = usePagination<Movie>(fetchFn)

  return (
    <div>
      <h1 className="text-3xl font-bold text-white mb-6">Películas</h1>

      <GenreFilter
        genres={genres}
        selectedId={selectedGenre}
        onSelect={setSelectedGenre}
      />

      {loading ? (
        <p className="text-gray-400">Cargando...</p>
      ) : data.length === 0 ? (
        <p className="text-gray-400">No se encontraron películas</p>
      ) : (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {data.map((item) => (
              <MediaCard
                key={item.id}
                item={item}
                onClick={() => openModal(item)}
              />
            ))}
          </div>
          <LoadMoreButton onClick={loadMore} loading={loadingMore} hasMore={hasMore} />
        </>
      )}
    </div>
  )
}

export default Movies