import { useCallback } from 'react'
import usePagination from '../hooks/usePagination'
import MediaCard from '../components/MediaCard'
import LoadMoreButton from '../components/LoadMoreButton'
import { useModal } from '../context/ModalContext'
import { getTrending, getPopularMovies, getPopularSeries } from '../services/tmdbService'
import type { MediaItem, Movie, Serie } from '../types/tmdb'
import type { TMDBResponse } from '../types/tmdb'

function Section<T extends MediaItem>({
  title,
  data,
  loading,
  loadingMore,
  hasMore,
  onCardClick,
  onLoadMore,
}: {
  title: string
  data: T[]
  loading: boolean
  loadingMore: boolean
  hasMore: boolean
  onCardClick: (item: MediaItem) => void
  onLoadMore: () => void
}) {
  return (
    <section className="mb-10">
      <h2 className="text-white text-xl font-semibold mb-4">{title}</h2>
      {loading ? (
        <p className="text-gray-400">Cargando...</p>
      ) : (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {data.map((item) => (
              <MediaCard key={item.id} item={item} onClick={() => onCardClick(item)} />
            ))}
          </div>
          <LoadMoreButton onClick={onLoadMore} loading={loadingMore} hasMore={hasMore} />
        </>
      )}
    </section>
  )
}

function Discover() {
  const { openModal } = useModal()

  const trending = usePagination<MediaItem>(useCallback(getTrending, []))
  const movies   = usePagination<Movie>(useCallback(getPopularMovies, []))
  const series   = usePagination<Serie>(useCallback(getPopularSeries, []))

  return (
    <div>
      <h1 className="text-3xl font-bold text-white mb-8">Discover</h1>

      <Section
        title="Tendencias"
        data={trending.data}
        loading={trending.loading}
        loadingMore={trending.loadingMore}
        hasMore={trending.hasMore}
        onCardClick={openModal}
        onLoadMore={trending.loadMore}
      />

      <Section
        title="Películas populares"
        data={movies.data}
        loading={movies.loading}
        loadingMore={movies.loadingMore}
        hasMore={movies.hasMore}
        onCardClick={openModal}
        onLoadMore={movies.loadMore}
      />

      <Section
        title="Series populares"
        data={series.data}
        loading={series.loading}
        loadingMore={series.loadingMore}
        hasMore={series.hasMore}
        onCardClick={openModal}
        onLoadMore={series.loadMore}
      />
    </div>
  )
}

export default Discover