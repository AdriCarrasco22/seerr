import api from './api'

export interface RequestItem {
  id: number
  mediaId: number
  mediaType: 'MOVIE' | 'TV'
  mediaTitle: string
  mediaPoster: string | null
  status: 'PENDING' | 'APPROVED' | 'REJECTED'
  createdAt: string
  user?: {
    id: number
    name: string
    email: string
  }
}

export interface CreateRequestData {
  mediaId: number
  mediaType: 'MOVIE' | 'TV'
  mediaTitle: string
  mediaPoster?: string | null
}

export const getMyRequests = () =>
  api.get<RequestItem[]>('/requests/my')

export const getAllRequests = () =>
  api.get<RequestItem[]>('/requests')

export const createRequest = (data: CreateRequestData) =>
  api.post<RequestItem>('/requests', data)

export const updateRequestStatus = (id: number, status: 'PENDING' | 'APPROVED' | 'REJECTED') =>
  api.patch<RequestItem>(`/requests/${id}/status`, { status })

export const deleteRequest = (id: number) =>
  api.delete(`/requests/${id}`)