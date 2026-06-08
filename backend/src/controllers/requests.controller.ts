import { Response } from 'express'
import prisma from '../lib/prisma'
import { AuthRequest } from '../types'

// Crear una nueva petición
export async function createRequest(req: AuthRequest, res: Response): Promise<void> {
  const { mediaId, mediaType, mediaTitle, mediaPoster } = req.body

  if (!mediaId || !mediaType || !mediaTitle) {
    res.status(400).json({ error: 'mediaId, mediaType y mediaTitle son obligatorios' })
    return
  }

  if (!['MOVIE', 'TV'].includes(mediaType)) {
    res.status(400).json({ error: 'mediaType debe ser MOVIE o TV' })
    return
  }

  try {
    // Comprobamos si el usuario ya pidió este contenido
    const existing = await prisma.request.findFirst({
      where: {
        userId: req.user!.userId,
        mediaId: Number(mediaId),
        mediaType,
      },
    })

    if (existing) {
      res.status(409).json({ error: 'Ya has solicitado este contenido' })
      return
    }

    const request = await prisma.request.create({
      data: {
        mediaId: Number(mediaId),
        mediaType,
        mediaTitle,
        mediaPoster: mediaPoster ?? null,
        userId: req.user!.userId,
      },
      include: { user: { select: { id: true, name: true, email: true } } },
    })

    res.status(201).json(request)
  } catch {
    res.status(500).json({ error: 'Error interno del servidor' })
  }
}

// Obtener las peticiones del usuario autenticado
export async function getMyRequests(req: AuthRequest, res: Response): Promise<void> {
  try {
    const requests = await prisma.request.findMany({
      where: { userId: req.user!.userId },
      orderBy: { createdAt: 'desc' },
    })

    res.json(requests)
  } catch {
    res.status(500).json({ error: 'Error interno del servidor' })
  }
}

// Obtener todas las peticiones (solo admin)
export async function getAllRequests(_req: AuthRequest, res: Response): Promise<void> {
  try {
    const requests = await prisma.request.findMany({
      orderBy: { createdAt: 'desc' },
      include: { user: { select: { id: true, name: true, email: true } } },
    })

    res.json(requests)
  } catch {
    res.status(500).json({ error: 'Error interno del servidor' })
  }
}

// Actualizar el estado de una petición (solo admin)
export async function updateRequestStatus(req: AuthRequest, res: Response): Promise<void> {
  const { id } = req.params
  const { status } = req.body

  if (!['PENDING', 'APPROVED', 'REJECTED'].includes(status)) {
    res.status(400).json({ error: 'Estado inválido' })
    return
  }

  try {
    const request = await prisma.request.update({
      where: { id: Number(id) },
      data: { status },
      include: { user: { select: { id: true, name: true, email: true } } },
    })

    res.json(request)
  } catch {
    res.status(500).json({ error: 'Petición no encontrada' })
  }
}

// Eliminar una petición
export async function deleteRequest(req: AuthRequest, res: Response): Promise<void> {
  const { id } = req.params

  try {
    const request = await prisma.request.findUnique({
      where: { id: Number(id) },
    })

    if (!request) {
      res.status(404).json({ error: 'Petición no encontrada' })
      return
    }

    // Un usuario solo puede eliminar sus propias peticiones
    // Un admin puede eliminar cualquiera
    if (request.userId !== req.user!.userId && req.user!.role !== 'ADMIN') {
      res.status(403).json({ error: 'No tienes permiso para eliminar esta petición' })
      return
    }

    await prisma.request.delete({ where: { id: Number(id) } })
    res.json({ message: 'Petición eliminada correctamente' })
  } catch {
    res.status(500).json({ error: 'Error interno del servidor' })
  }
}