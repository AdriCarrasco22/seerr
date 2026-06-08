import { useState, useEffect, useCallback } from 'react'
import type { TMDBResponse, MediaItem } from '../types/tmdb'

type FetchFn<T> = (page: number) => Promise<{ data: TMDBResponse<T> }>

interface PaginationState<T> {
  data: T[]
  loading: boolean
  loadingMore: boolean
  error: string | null
  hasMore: boolean
}

function usePagination<T extends MediaItem>(fetchFn: FetchFn<T>) {
  const [state, setState] = useState<PaginationState<T>>({
    data: [],
    loading: true,
    loadingMore: false,
    error: null,
    hasMore: false,
  })
  const [page, setPage] = useState(1)

  // Carga inicial
  useEffect(() => {
    let cancelled = false

    setState((prev) => ({ ...prev, loading: true, error: null }))

    fetchFn(1)
      .then((res) => {
        if (cancelled) return
        setState({
          data: res.data.results,
          loading: false,
          loadingMore: false,
          error: null,
          hasMore: res.data.page < res.data.total_pages,
        })
        setPage(1)
      })
      .catch(() => {
        if (cancelled) return
        setState((prev) => ({ ...prev, loading: false, error: 'Error al cargar los datos' }))
      })

    return () => { cancelled = true }
  }, [fetchFn])

  // Cargar más
  const loadMore = useCallback(() => {
    const nextPage = page + 1

    setState((prev) => ({ ...prev, loadingMore: true }))

    fetchFn(nextPage)
      .then((res) => {
        setState((prev) => ({
          ...prev,
          data: [...prev.data, ...res.data.results],
          loadingMore: false,
          hasMore: res.data.page < res.data.total_pages,
        }))
        setPage(nextPage)
      })
      .catch(() => {
        setState((prev) => ({ ...prev, loadingMore: false, error: 'Error al cargar más datos' }))
      })
  }, [fetchFn, page])

  return { ...state, loadMore }
}

export default usePagination