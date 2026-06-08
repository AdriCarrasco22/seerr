import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'

const FEATURES = [
  { icon: '🎬', title: 'Descubre contenido', description: 'Explora películas y series trending, populares y filtradas por género.' },
  { icon: '🔍', title: 'Búsqueda instantánea', description: 'Encuentra cualquier título al instante con resultados en tiempo real.' },
  { icon: '📋', title: 'Sistema de peticiones', description: 'Solicita contenido y gestiona peticiones con un panel de administración.' },
  { icon: '🔐', title: 'Autenticación segura', description: 'Registro, login y roles de usuario con tokens JWT.' },
]

const TECH = ['React', 'TypeScript', 'Tailwind CSS', 'Node.js', 'Express', 'PostgreSQL', 'Prisma', 'JWT', 'TMDB API']
const GITHUB_URL = 'https://github.com/TU_USUARIO/seerr'
const openGithub = () => window.open(GITHUB_URL, '_blank')

function Landing() {
  const { loginAsDemo } = useAuth()
  const navigate = useNavigate()
  const [loadingDemo, setLoadingDemo] = useState<'user' | 'admin' | null>(null)

  const handleDemo = async (type: 'user' | 'admin') => {
    setLoadingDemo(type)
    try {
      await loginAsDemo(type)
      navigate('/')
    } catch {
      toast.error('Error al iniciar la demo. Inténtalo de nuevo.')
    } finally {
      setLoadingDemo(null)
    }
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white">

      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-8 py-4 bg-gray-950/80 backdrop-blur-sm border-b border-white/5">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 bg-purple-600 rounded-full" />
          <span className="font-semibold text-lg">Seerr</span>
        </div>
        <div className="flex items-center gap-6">
          <button onClick={openGithub} className="text-gray-400 hover:text-white text-sm transition-colors">
            GitHub
          </button>
          <Link to="/login" className="text-sm text-gray-400 hover:text-white transition-colors">
            Iniciar sesión
          </Link>
          <button
            onClick={() => handleDemo('user')}
            disabled={loadingDemo !== null}
            className="text-sm px-4 py-1.5 bg-purple-600 hover:bg-purple-700 disabled:opacity-50 rounded-lg transition-colors"
          >
            {loadingDemo === 'user' ? 'Entrando...' : 'Probar demo'}
          </button>
        </div>
      </nav>

      <section className="pt-40 pb-20 px-8 flex flex-col items-center text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-gray-400 text-xs mb-8">
          <span className="w-1.5 h-1.5 rounded-full bg-purple-500 inline-block" />
          Proyecto Fullstack — Portfolio
        </div>
        <h1 className="text-6xl font-bold tracking-tight max-w-3xl mb-6 leading-tight">
          Descubre y solicita
          <span className="text-purple-400"> contenido</span>
        </h1>
        <p className="text-gray-400 text-lg max-w-lg mb-10 leading-relaxed">
          Plataforma fullstack para explorar películas y series,
          con sistema de peticiones y panel de administración.
        </p>
        <div className="flex items-center gap-3">
          <button
            onClick={() => handleDemo('user')}
            disabled={loadingDemo !== null}
            className="px-6 py-2.5 bg-purple-600 hover:bg-purple-700 disabled:opacity-50 rounded-lg text-sm font-medium transition-colors"
          >
            {loadingDemo === 'user' ? 'Entrando...' : 'Probar como Usuario'}
          </button>
          <button
            onClick={() => handleDemo('admin')}
            disabled={loadingDemo !== null}
            className="px-6 py-2.5 bg-white/5 hover:bg-white/10 disabled:opacity-50 border border-white/10 rounded-lg text-sm font-medium transition-colors"
          >
            {loadingDemo === 'admin' ? 'Entrando...' : 'Probar como Admin'}
          </button>
        </div>
        <p className="text-gray-600 text-xs mt-4">Sin registro. Acceso inmediato.</p>
      </section>

      <section className="px-8 pb-24 flex justify-center">
        <div className="w-full max-w-5xl rounded-xl overflow-hidden border border-white/10 shadow-2xl shadow-black/50">
          <div className="bg-gray-900 px-4 py-3 flex items-center gap-2 border-b border-white/5">
            <div className="flex gap-1.5">
              <div className="w-3 h-3 rounded-full bg-red-500/70" />
              <div className="w-3 h-3 rounded-full bg-yellow-500/70" />
              <div className="w-3 h-3 rounded-full bg-green-500/70" />
            </div>
            <div className="flex-1 flex justify-center">
              <div className="bg-gray-800 rounded-md px-4 py-1 text-gray-500 text-xs w-48 text-center">
                seerr.vercel.app
              </div>
            </div>
          </div>
          <img
            src="/mockup.png"
            alt="Captura de Seerr"
            className="w-full object-cover object-top"
          />
        </div>
      </section>

      <section className="px-8 py-20 border-t border-white/5">
        <div className="max-w-5xl mx-auto">
          <p className="text-gray-500 text-xs uppercase tracking-widest text-center mb-12">Funcionalidades</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {FEATURES.map((feature) => (
              <div key={feature.title} className="p-6 rounded-xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.04] transition-colors">
                <span className="text-2xl mb-4 block">{feature.icon}</span>
                <h3 className="text-white font-medium mb-2 text-sm">{feature.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-8 py-20 border-t border-white/5">
        <div className="max-w-5xl mx-auto text-center">
          <p className="text-gray-500 text-xs uppercase tracking-widest mb-10">Stack tecnológico</p>
          <div className="flex flex-wrap justify-center gap-2">
            {TECH.map((tech) => (
              <span key={tech} className="px-4 py-1.5 rounded-full text-sm text-gray-400 border border-white/10 bg-white/[0.02]">
                {tech}
              </span>
            ))}
          </div>
        </div>
      </section>

      <footer className="border-t border-white/5 px-8 py-8">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 bg-purple-600 rounded-full" />
            <span className="text-gray-400 text-sm">Seerr</span>
          </div>
          <p className="text-gray-600 text-sm">
            Desarrollado por <span className="text-gray-400">Adrián Carrasco Fernández</span>
          </p>
          <button onClick={openGithub} className="text-gray-400 hover:text-white text-sm transition-colors">
            Ver en GitHub
          </button>
        </div>
      </footer>

    </div>
  )
}

export default Landing