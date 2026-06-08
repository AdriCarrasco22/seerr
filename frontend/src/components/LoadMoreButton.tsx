interface Props {
  onClick: () => void
  loading: boolean
  hasMore: boolean
}

function LoadMoreButton({ onClick, loading, hasMore }: Props) {
  if (!hasMore) return null

  return (
    <div className="flex justify-center mt-6 mb-2">
      <button
        onClick={onClick}
        disabled={loading}
        className="px-6 py-2 rounded-lg bg-purple-600 hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-medium transition-colors"
      >
        {loading ? 'Cargando...' : 'Cargar más'}
      </button>
    </div>
  )
}

export default LoadMoreButton