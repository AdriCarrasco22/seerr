/*
 Un custom hook es una función que encapsula lógica de React para no repetirla en cada componente
*/

/*
Cada página va a necesitar hacer lo mismo — llamar a una API, gestionar un estado de carga y gestionar posibles errores. En lugar de escribir eso tres veces, lo escribimos una vez en un hook.
 */

import { useState, useEffect } from 'react'

interface FetchState<T> {
  data: T | null
  loading: boolean
  error: string | null
}

function useFetch<T>(fetchFn: () => Promise<{ data: T }>) {
  const [state, setState] = useState<FetchState<T>>({
    data: null,
    loading: true,
    error: null,
  })

  useEffect(() => {
    let cancelled = false

    fetchFn()
      .then((res) => {
        if (!cancelled) {
          setState({ data: res.data, loading: false, error: null })
        }
      })
      .catch(() => {
        if (!cancelled) {
          setState({ data: null, loading: false, error: 'Error al cargar los datos' })
        }
      })

    return () => {
      cancelled = true
    }
  }, [])

  return state
}

export default useFetch