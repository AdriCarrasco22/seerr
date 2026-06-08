import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './context/AuthContext'
import Navbar from './components/Navbar'
import ScrollToTop from './components/ScrollToTop'
import Landing from './pages/Landing'
import Discover from './pages/Discover'
import Movies from './pages/Movies'
import Series from './pages/Series'
import Requests from './pages/Requests'
import Login from './pages/Login'
import Register from './pages/Register'
import Profile from './pages/Profile'


function App() {
  const { isAuthenticated, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <p className="text-gray-400">Cargando...</p>
      </div>
    )
  }

  if (!isAuthenticated) {
    return (
      <Routes>
        <Route path="/"         element={<Landing />} />
        <Route path="/login"    element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="*"         element={<Navigate to="/" replace />} />
      </Routes>
    )
  }

  return (
    <div className="bg-gray-900 min-h-screen text-white flex">
      <Navbar />
      <main className="ml-56 flex-1 p-8">
        <Routes>
          <Route path="/"         element={<Discover />} />
          <Route path="/movies"   element={<Movies />} />
          <Route path="/series"   element={<Series />} />
          <Route path="/requests" element={<Requests />} />
          <Route path="*"         element={<Navigate to="/" replace />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
      </main>
      <ScrollToTop />
    </div>
  )
}

export default App