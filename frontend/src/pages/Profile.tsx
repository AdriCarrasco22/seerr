import { useState, FormEvent } from 'react'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'

function Profile() {
  const { user, updateProfile } = useAuth()

  const [name, setName] = useState(user?.name ?? '')
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loadingProfile, setLoadingProfile] = useState(false)
  const [loadingPassword, setLoadingPassword] = useState(false)

  const handleUpdateName = async (e: FormEvent) => {
    e.preventDefault()
    if (!name.trim()) return
    setLoadingProfile(true)
    try {
      await updateProfile(name)
      toast.success('Nombre actualizado correctamente')
    } catch {
      toast.error('Error al actualizar el nombre')
    } finally {
      setLoadingProfile(false)
    }
  }

  const handleUpdatePassword = async (e: FormEvent) => {
    e.preventDefault()
    if (newPassword !== confirmPassword) {
      toast.error('Las contraseñas no coinciden')
      return
    }
    setLoadingPassword(true)
    try {
      await updateProfile(name, currentPassword, newPassword)
      toast.success('Contraseña actualizada correctamente')
      setCurrentPassword('')
      setNewPassword('')
      setConfirmPassword('')
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Error al actualizar la contraseña'
      toast.error(message)
    } finally {
      setLoadingPassword(false)
    }
  }

  return (
    <div className="max-w-xl">
      <h1 className="text-3xl font-bold text-white mb-2">Mi perfil</h1>
      <p className="text-gray-400 text-sm mb-8">Gestiona tu información personal</p>

      {/* Info de la cuenta */}
      <div className="bg-gray-800/50 rounded-xl p-6 border border-white/5 mb-6">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-14 h-14 rounded-full bg-purple-600 flex items-center justify-center text-white text-xl font-bold flex-shrink-0">
            {user?.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <p className="text-white font-medium">{user?.name}</p>
            <p className="text-gray-400 text-sm">{user?.email}</p>
            <span className="text-xs px-2 py-0.5 rounded-full bg-purple-600/20 text-purple-400 mt-1 inline-block">
              {user?.role === 'ADMIN' ? 'Administrador' : 'Usuario'}
            </span>
          </div>
        </div>
      </div>

      {/* Formulario nombre */}
      <div className="bg-gray-800/50 rounded-xl p-6 border border-white/5 mb-6">
        <h2 className="text-white font-medium mb-4">Información personal</h2>
        <form onSubmit={handleUpdateName} className="flex flex-col gap-4">
          <div>
            <label className="text-gray-400 text-sm mb-1 block">Nombre</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-gray-700 text-white rounded-lg px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-purple-600"
              required
            />
          </div>
          <div>
            <label className="text-gray-400 text-sm mb-1 block">Email</label>
            <input
              type="email"
              value={user?.email}
              disabled
              className="w-full bg-gray-700/50 text-gray-500 rounded-lg px-4 py-2.5 text-sm outline-none cursor-not-allowed"
            />
            <p className="text-gray-600 text-xs mt-1">El email no se puede modificar</p>
          </div>
          <button
            type="submit"
            disabled={loadingProfile}
            className="w-full bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white text-sm font-medium py-2.5 rounded-lg transition-colors"
          >
            {loadingProfile ? 'Guardando...' : 'Guardar cambios'}
          </button>
        </form>
      </div>

      {/* Formulario contraseña */}
      <div className="bg-gray-800/50 rounded-xl p-6 border border-white/5">
        <h2 className="text-white font-medium mb-4">Cambiar contraseña</h2>
        <form onSubmit={handleUpdatePassword} className="flex flex-col gap-4">
          <div>
            <label className="text-gray-400 text-sm mb-1 block">Contraseña actual</label>
            <input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="w-full bg-gray-700 text-white rounded-lg px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-purple-600"
              placeholder="••••••••"
              required
            />
          </div>
          <div>
            <label className="text-gray-400 text-sm mb-1 block">Nueva contraseña</label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full bg-gray-700 text-white rounded-lg px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-purple-600"
              placeholder="Mínimo 6 caracteres"
              minLength={6}
              required
            />
          </div>
          <div>
            <label className="text-gray-400 text-sm mb-1 block">Confirmar nueva contraseña</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full bg-gray-700 text-white rounded-lg px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-purple-600"
              placeholder="••••••••"
              required
            />
          </div>
          <button
            type="submit"
            disabled={loadingPassword}
            className="w-full bg-gray-700 hover:bg-gray-600 disabled:opacity-50 text-white text-sm font-medium py-2.5 rounded-lg transition-colors"
          >
            {loadingPassword ? 'Actualizando...' : 'Cambiar contraseña'}
          </button>
        </form>
      </div>
    </div>
  )
}

export default Profile