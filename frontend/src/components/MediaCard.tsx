import type { MediaItem } from '../types/tmdb'

const IMAGE_BASE = 'https://image.tmdb.org/t/p/w500'

interface Props {
  item: MediaItem
  onClick?: () => void
}

function MediaCard({ item, onClick }: Props) {
  const title = 'title' in item ? item.title : item.name
  const date = 'release_date' in item ? item.release_date : item.first_air_date
  const type = 'title' in item ? 'PELÍCULA' : 'SERIE'
  const year = date ? new Date(date).getFullYear() : '—'

  return (
    <div className="relative group cursor-pointer rounded-lg overflow-hidden bg-gray-800" onClick={onClick}>

      {/* Poster */}
      {item.poster_path ? (
        <img
          src={`${IMAGE_BASE}${item.poster_path}`}
          alt={title}
          className="w-full aspect-[2/3] object-cover"
        />
      ) : (
        <div className="w-full aspect-[2/3] bg-gray-700 flex items-center justify-center">
          <span className="text-gray-500 text-sm">Sin imagen</span>
        </div>
      )}

      {/* Badge tipo */}
      <span className="absolute top-2 left-2 text-xs font-semibold px-2 py-1 rounded bg-black/70 text-purple-400">
        {type}
      </span>

      {/* Info al hacer hover */}
      <div className="absolute inset-0 bg-black/80 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-3">
        <p className="text-white font-semibold text-sm leading-tight">{title}</p>
        <p className="text-gray-400 text-xs mt-1">{year}</p>
        <div className="flex items-center gap-1 mt-1">
          <span className="text-yellow-400 text-xs">★</span>
          <span className="text-gray-300 text-xs">{item.vote_average.toFixed(1)}</span>
        </div>
      </div>

    </div>
  )
}

export default MediaCard