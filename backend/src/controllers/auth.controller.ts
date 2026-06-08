import { Request, Response } from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import prisma from '../lib/prisma'
import { AuthPayload } from '../types'

export async function register(req: Request, res: Response): Promise<void> {
  const { email, password, name } = req.body

  // Validación básica
  if (!email || !password || !name) {
    res.status(400).json({ error: 'Todos los campos son obligatorios' })
    return
  }

  if (password.length < 6) {
    res.status(400).json({ error: 'La contraseña debe tener al menos 6 caracteres' })
    return
  }

  try {
    // Comprobamos si el email ya existe
    const existing = await prisma.user.findUnique({ where: { email } })
    if (existing) {
      res.status(409).json({ error: 'El email ya está registrado' })
      return
    }

    // Encriptamos la contraseña — el 10 es el "salt rounds" (coste computacional)
    const hashedPassword = await bcrypt.hash(password, 10)

    const user = await prisma.user.create({
      data: { email, password: hashedPassword, name },
    })

    const payload: AuthPayload = { userId: user.id, role: user.role }
    const token = jwt.sign(payload, process.env.JWT_SECRET as string, { expiresIn: '7d' })

    res.status(201).json({
      token,
      user: { id: user.id, email: user.email, name: user.name, role: user.role },
    })
  } catch {
    res.status(500).json({ error: 'Error interno del servidor' })
  }
}

export async function login(req: Request, res: Response): Promise<void> {
  const { email, password } = req.body

  if (!email || !password) {
    res.status(400).json({ error: 'Email y contraseña son obligatorios' })
    return
  }

  try {
    const user = await prisma.user.findUnique({ where: { email } })

    if (!user) {
      res.status(401).json({ error: 'Credenciales incorrectas' })
      return
    }

    const passwordMatch = await bcrypt.compare(password, user.password)

    if (!passwordMatch) {
      res.status(401).json({ error: 'Credenciales incorrectas' })
      return
    }

    const payload: AuthPayload = { userId: user.id, role: user.role }
    const token = jwt.sign(payload, process.env.JWT_SECRET as string, { expiresIn: '7d' })

    res.json({
      token,
      user: { id: user.id, email: user.email, name: user.name, role: user.role },
    })
  } catch {
    res.status(500).json({ error: 'Error interno del servidor' })
  }
}

export async function me(req: Request, res: Response): Promise<void> {
  const authReq = req as import('../types').AuthRequest

  try {
    const user = await prisma.user.findUnique({
      where: { id: authReq.user!.userId },
      select: { id: true, email: true, name: true, role: true, createdAt: true },
    })

    if (!user) {
      res.status(404).json({ error: 'Usuario no encontrado' })
      return
    }

    res.json(user)
  } catch {
    res.status(500).json({ error: 'Error interno del servidor' })
  }
}

export async function updateProfile(req: Request, res: Response): Promise<void> {
  const authReq = req as import('../types').AuthRequest

  const { name, currentPassword, newPassword } = req.body

  if (!name) {
    res.status(400).json({ error: 'El nombre es obligatorio' })
    return
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: authReq.user!.userId }
    })

    if (!user) {
      res.status(404).json({ error: 'Usuario no encontrado' })
      return
    }

    // Si quiere cambiar la contraseña
    if (newPassword) {
      if (!currentPassword) {
        res.status(400).json({ error: 'Debes introducir tu contraseña actual' })
        return
      }

      const passwordMatch = await bcrypt.compare(currentPassword, user.password)
      if (!passwordMatch) {
        res.status(401).json({ error: 'La contraseña actual es incorrecta' })
        return
      }

      if (newPassword.length < 6) {
        res.status(400).json({ error: 'La nueva contraseña debe tener al menos 6 caracteres' })
        return
      }
    }

    const updatedUser = await prisma.user.update({
      where: { id: authReq.user!.userId },
      data: {
        name,
        ...(newPassword && {
          password: await bcrypt.hash(newPassword, 10)
        }),
      },
      select: { id: true, email: true, name: true, role: true }
    })

    res.json(updatedUser)
  } catch {
    res.status(500).json({ error: 'Error interno del servidor' })
  }
}