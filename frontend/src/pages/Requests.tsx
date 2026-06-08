import { useState, useEffect, useCallback } from 'react'
import { useAuth } from '../context/AuthContext'
import RequestStatusBadge from '../components/RequestStatusBadge'
import toast from 'react-hot-toast'
import {
  getMyRequests,
  getAllRequests,
  updateRequestStatus,
  deleteRequest,
  type RequestItem,
} from '../services/requestsService'

const IMAGE_BASE = 'https://image.tmdb.org/t/p/w200'

function Requests() {
  const { isAdmin } = useAuth()
  const [requests, setRequests] = useState<RequestItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchRequests = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const res = isAdmin ? await getAllRequests() : await getMyRequests()
      setRequests(res.data)
    } catch {
      setError('Error al cargar las peticiones')
    } finally {
      setLoading(false)
    }
  }, [isAdmin])

  useEffect(() => {
    fetchRequests()
  }, [fetchRequests])

  const handleStatusChange = async (id: number, status: 'PENDING' | 'APPROVED' | 'REJECTED') => {
    try {
      await updateRequestStatus(id, status)
      setRequests((prev) =>
        prev.map((r) => (r.id === id ? { ...r, status } : r))
      )
      toast.success('Estado actualizado')
    } catch {
      toast.error('Error al actualizar el estado')
    }
  }

  // Reemplaza handleDelete por esto:
  const handleDelete = async (id: number) => {
    toast((t) => (
      <div className="flex items-center gap-3">
        <p className="text-sm">¿Eliminar esta petición?</p>
        <button
          onClick={async () => {
            toast.dismiss(t.id)
            try {
              await deleteRequest(id)
              setRequests((prev) => prev.filter((r) => r.id !== id))
              toast.success('Petición eliminada')
            } catch {
              toast.error('Error al eliminar la petición')
            }
          }}
          className="px-3 py-1 bg-red-500 hover:bg-red-600 rounded text-xs font-medium transition-colors"
        >
          Eliminar
        </button>
        <button
          onClick={() => toast.dismiss(t.id)}
          className="px-3 py-1 bg-gray-600 hover:bg-gray-500 rounded text-xs font-medium transition-colors"
        >
          Cancelar
        </button>
      </div>
    ), {
      duration: 5000,
      style: {
        background: '#1f2937',
        color: '#f9fafb',
        border: '1px solid rgba(255,255,255,0.05)',
      },
    })
  }

  if (loading) return <p className="text-gray-400">Cargando peticiones...</p>
  if (error) return <p className="text-red-400">{error}</p>

  return (
    <div>
      <h1 className="text-3xl font-bold text-white mb-2">Requests</h1>
      <p className="text-gray-400 text-sm mb-8">
        {isAdmin ? 'Gestiona todas las peticiones de los usuarios' : 'Tus peticiones de contenido'}
      </p>

      {requests.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <span className="text-6xl mb-4">📭</span>
          <p className="text-gray-400">No hay peticiones todavía</p>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {requests.map((request) => (
            <div
              key={request.id}
              className="bg-gray-800 rounded-xl p-4 flex items-center gap-4"
            >
              {/* Poster */}
              <div className="w-14 h-20 rounded-lg overflow-hidden bg-gray-700 flex-shrink-0">
                {request.mediaPoster ? (
                  <img
                    src={`${IMAGE_BASE}${request.mediaPoster}`}
                    alt={request.mediaTitle}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-500 text-xs">
                    Sin imagen
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <p className="text-white font-medium truncate">{request.mediaTitle}</p>
                <p className="text-gray-400 text-xs mt-0.5">
                  {request.mediaType === 'MOVIE' ? 'Película' : 'Serie'}
                </p>
                {isAdmin && request.user && (
                  <p className="text-gray-500 text-xs mt-1">
                    Solicitado por <span className="text-gray-300">{request.user.name}</span>
                  </p>
                )}
                <p className="text-gray-600 text-xs mt-1">
                  {new Date(request.createdAt).toLocaleDateString('es-ES', {
                    day: 'numeric', month: 'long', year: 'numeric'
                  })}
                </p>
              </div>

              {/* Estado y acciones */}
              <div className="flex items-center gap-3 flex-shrink-0">
                <RequestStatusBadge status={request.status} />

                {isAdmin && (
                  <select
                    value={request.status}
                    onChange={(e) => handleStatusChange(request.id, e.target.value as 'PENDING' | 'APPROVED' | 'REJECTED')}
                    className="bg-gray-700 text-white text-xs rounded-lg px-2 py-1.5 outline-none focus:ring-2 focus:ring-purple-600"
                  >
                    <option value="PENDING">Pendiente</option>
                    <option value="APPROVED">Aprobar</option>
                    <option value="REJECTED">Rechazar</option>
                  </select>
                )}

                <button
                  onClick={() => handleDelete(request.id)}
                  className="text-gray-500 hover:text-red-400 transition-colors text-sm"
                  title="Eliminar petición"
                >
                  ✕
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default Requests