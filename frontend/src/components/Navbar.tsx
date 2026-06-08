import { NavLink, useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import SearchBar from './SearchBar'

const NAV_ITEMS = [
  { path: '/', label: 'Discover' },
  { path: '/movies', label: 'Movies' },
  { path: '/series', label: 'Series' },
  { path: '/requests', label: 'Requests' },
]

function Navbar() {
  const { user, logout, isAdmin } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <aside className="fixed top-0 left-0 h-screen w-56 bg-gray-800 flex flex-col p-4 z-50">

      {/* Logo */}
      <div className="flex items-center gap-2 mb-6 px-2">
        <div className="w-8 h-8 bg-purple-600 rounded-full" />
        <span className="text-white font-bold text-xl">Seerr</span>
      </div>

      {/* Buscador */}
      <SearchBar />

      {/* Navegación */}
      <nav className="flex flex-col gap-1">
        {NAV_ITEMS.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.path === '/'}
            className={({ isActive }) =>
              `px-3 py-2 rounded-lg text-sm transition-colors ${isActive
                ? 'bg-purple-600 text-white font-medium'
                : 'text-gray-400 hover:text-white hover:bg-gray-700'
              }`
            }
          >
            {item.label}
          </NavLink>
        ))}
      </nav>

      {/* Usuario */}
      <div className="mt-auto flex flex-col gap-2">
        {isAdmin && (
          <span className="text-xs text-purple-400 font-medium px-3">
            Administrador
          </span>
        )}
        <Link
          to="/profile"
          className="px-3 py-2 rounded-lg bg-gray-700/50 hover:bg-gray-700 transition-colors block"
        >
          <p className="text-white text-sm font-medium truncate">{user?.name}</p>
          <p className="text-gray-400 text-xs truncate">{user?.email}</p>
        </Link>
        <button
          onClick={handleLogout}
          className="px-3 py-2 rounded-lg text-sm text-gray-400 hover:text-white hover:bg-gray-700 transition-colors text-left"
        >
          Cerrar sesión
        </button>
      </div>

    </aside>
  )
}

export default Navbar