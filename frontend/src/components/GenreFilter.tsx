import type { Genre } from '../services/tmdbService'

interface Props {
  genres: Genre[]
  selectedId: number | null
  onSelect: (id: number | null) => void
}

function GenreFilter({ genres, selectedId, onSelect }: Props) {
  return (
    <div className="flex flex-wrap gap-2 mb-8">
      <button
        onClick={() => onSelect(null)}
        className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
          selectedId === null
            ? 'bg-purple-600 text-white'
            : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
        }`}
      >
        Todos
      </button>
      {genres.map((genre) => (
        <button
          key={genre.id}
          onClick={() => onSelect(genre.id)}
          className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
            selectedId === genre.id
              ? 'bg-purple-600 text-white'
              : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
          }`}
        >
          {genre.name}
        </button>
      ))}
    </div>
  )
}

export default GenreFilter