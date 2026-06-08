import { Request } from 'express'

export interface AuthPayload {
  userId: number
  role: 'USER' | 'ADMIN'
}

// Extendemos el tipo Request de Express para incluir el usuario autenticado
export interface AuthRequest extends Request {
  user?: AuthPayload
}