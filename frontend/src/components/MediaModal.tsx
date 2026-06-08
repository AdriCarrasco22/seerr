import { useEffect, useState } from 'react'
import type { MediaItem, Video } from '../types/tmdb'
import { getMovieVideos, getSerieVideos } from '../services/tmdbService'
import { useAuth } from '../context/AuthContext'
import { createRequest } from '../services/requestsService'
import toast from 'react-hot-toast'

const BACKDROP_BASE = 'https://image.tmdb.org/t/p/w1280'

interface Props {
  item: MediaItem | null
  isOpen: boolean
  onClose: () => void
}

async function checkYouTubeThumbnail(key: string): Promise<boolean> {
  return new Promise((resolve) => {
    const img = new Image()
    img.src = `https://img.youtube.com/vi/${key}/mqdefault.jpg`
    img.onload = () => resolve(img.width > 120)
    img.onerror = () => resolve(false)
  })
}

function MediaModal({ item, isOpen, onClose }: Props) {
  const [trailer, setTrailer] = useState<Video | null>(null)
  const [loadingVideo, setLoadingVideo] = useState(false)
  const [requesting, setRequesting] = useState(false)
  const [requested, setRequested] = useState(false)

  const { isAuthenticated } = useAuth()

  const handleRequest = async () => {
    if (!item) return
    setRequesting(true)
    try {
      await createRequest({
        mediaId: item.id,
        mediaType: 'title' in item ? 'MOVIE' : 'TV',
        mediaTitle: 'title' in item ? item.title : item.name,
        mediaPoster: item.poster_path,
      })
      setRequested(true)
      toast.success('Petición enviada correctamente')
    } catch {
      toast.error('Ya has solicitado este contenido')
    } finally {
      setRequesting(false)
    }
  }

  useEffect(() => {
    if (!item) return

    setRequested(false)
    setTrailer(null)
    setLoadingVideo(true)

    const isMovie = 'title' in item
    const fetchVideos = isMovie ? getMovieVideos(item.id) : getSerieVideos(item.id)

    fetchVideos
      .then(async (res) => {
        const candidates = res.data.results.filter((v) => v.site === 'YouTube')

        for (const video of candidates) {
          const isAvailable = await checkYouTubeThumbnail(video.key)
          if (isAvailable) {
            setTrailer(video)
            break
          }
        }
      })
      .finally(() => setLoadingVideo(false))
  }, [item])

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [onClose])

  if (!isOpen || !item) return null

  const title = 'title' in item ? item.title : item.name
  const date = 'release_date' in item ? item.release_date : item.first_air_date
  const year = date ? new Date(date).getFullYear() : '—'

  return (
    <div
      className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="relative bg-gray-900 rounded-xl overflow-hidden w-full max-w-4xl max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Botón cerrar */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 z-10 text-white bg-black/50 hover:bg-black/80 rounded-full w-8 h-8 flex items-center justify-center transition-colors"
        >
          ✕
        </button>

        {/* Backdrop */}
        {item.backdrop_path && (
          <div className="relative">
            <img
              src={`${BACKDROP_BASE}${item.backdrop_path}`}
              alt={title}
              className="w-full h-36 object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent" />
          </div>
        )}

        {/* Contenido en dos columnas */}
        <div className="flex gap-6 p-6 items-start">

          {/* Columna izquierda — texto */}
          <div className="w-64 flex-shrink-0">
            <h2 className="text-white text-lg font-bold leading-tight mb-3">{title}</h2>

            <div className="flex flex-wrap items-center gap-2 mb-4">
              <span className="text-gray-400 text-sm">{year}</span>
              <span className="text-yellow-400 text-sm">★ {item.vote_average.toFixed(1)}</span>
              <span className="text-xs px-2 py-1 rounded bg-purple-600/30 text-purple-400">
                {'title' in item ? 'Película' : 'Serie'}
              </span>
            </div>

            <p className="text-gray-300 text-sm leading-relaxed">
              {item.overview || 'Sin descripción disponible.'}
            </p>

            {isAuthenticated && (
              <button
                onClick={handleRequest}
                disabled={requesting || requested}
                className="mt-6 w-full bg-purple-600 hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-medium py-2.5 rounded-lg transition-colors"
              >
                {requested ? '✓ Solicitado' : requesting ? 'Solicitando...' : 'Solicitar'}
              </button>
            )}
          </div>

          {/* Columna derecha — trailer */}
          <div className="flex-1 rounded-lg overflow-hidden aspect-video flex items-center justify-center">
            {loadingVideo ? (
              <p className="text-gray-500 text-sm">Cargando trailer...</p>
            ) : trailer ? (
              <iframe
                src={`https://www.youtube.com/embed/${trailer.key}?autoplay=1&mute=1`}
                title={`Trailer de ${title}`}
                className="w-full h-full"
                allowFullScreen
                allow="autoplay; encrypted-media"
              />
            ) : (
              <div className="flex flex-col items-center justify-center gap-4 p-6 text-center w-full h-full">
                <span className="text-9xl">🍿</span>
                <p className="text-gray-300 text-base font-medium">
                  ¡Ups! Parece que el tráiler no está disponible
                </p>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  )
}

export default MediaModal