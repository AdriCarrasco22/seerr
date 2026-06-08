import { useState, useEffect, useRef } from 'react'
import useDebounce from '../hooks/useDebounce'
import { searchContent } from '../services/tmdbService'
import type { MediaItem } from '../types/tmdb'
import { useModal } from '../context/ModalContext'

const IMAGE_BASE = 'https://image.tmdb.org/t/p/w200'

function SearchBar() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<MediaItem[]>([])
  const [loading, setLoading] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const debouncedQuery = useDebounce(query, 400)
  const containerRef = useRef<HTMLDivElement>(null)
  const { openModal } = useModal()

  useEffect(() => {
    if (debouncedQuery.trim().length < 2) {
      setResults([])
      setIsOpen(false)
      return
    }

    setLoading(true)
    searchContent(debouncedQuery)
      .then((res) => {
        const filtered = res.data.results.filter(
          (item) => item.poster_path && (('title' in item && item.title) || ('name' in item && item.name))
        )
        setResults(filtered.slice(0, 6))
        setIsOpen(true)
      })
      .finally(() => setLoading(false))
  }, [debouncedQuery])

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleSelect = (item: MediaItem) => {
    setQuery('')
    setResults([])
    setIsOpen(false)
    openModal(item)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      setQuery('')
      setIsOpen(false)
    }
  }

  return (
    <div ref={containerRef} className="relative px-2 mb-4">
      {/* Input */}
      <div className="relative">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">
          🔍
        </span>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Buscar..."
          className="w-full bg-gray-700 text-white text-sm rounded-lg pl-8 pr-3 py-2 outline-none focus:ring-2 focus:ring-purple-600 placeholder-gray-500"
        />
        {loading && (
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs">
            ⏳
          </span>
        )}
      </div>

      {/* Dropdown de resultados */}
      {isOpen && results.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-gray-800 rounded-lg overflow-hidden shadow-xl z-50 border border-gray-700">
          {results.map((item) => {
            const title = 'title' in item ? item.title : item.name
            const year = 'release_date' in item
              ? item.release_date?.slice(0, 4)
              : item.first_air_date?.slice(0, 4)
            const type = 'title' in item ? 'Película' : 'Serie'

            return (
              <button
                key={item.id}
                onClick={() => handleSelect(item)}
                className="w-full flex items-center gap-3 px-3 py-2 hover:bg-gray-700 transition-colors text-left"
              >
                <img
                  src={`${IMAGE_BASE}${item.poster_path}`}
                  alt={title}
                  className="w-8 h-12 object-cover rounded flex-shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <p className="text-white text-sm font-medium truncate">{title}</p>
                  <p className="text-gray-400 text-xs">{year} · {type}</p>
                </div>
              </button>
            )
          })}
        </div>
      )}

      {/* Sin resultados */}
      {isOpen && results.length === 0 && !loading && debouncedQuery.length >= 2 && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-gray-800 rounded-lg p-4 text-center shadow-xl z-50 border border-gray-700">
          <p className="text-gray-400 text-sm">Sin resultados para "{debouncedQuery}"</p>
        </div>
      )}
    </div>
  )
}

export default SearchBar