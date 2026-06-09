# Seerr

Plataforma fullstack de descubrimiento y solicitud de películas y series, inspirada en Overseerr. Permite a los usuarios explorar contenido mediante la API de TMDB, solicitar títulos y gestionar peticiones a través de un panel de administración.

## Demo

[Ver demo en vivo](https://seerr-flblm1q5a-adrians-projects-38e5ae39.vercel.app)

| Rol | Email | Contraseña |
|-----|-------|------------|
| Usuario | demo@seerr.com | demo1234 |
| Admin | admin@seerr.com | admin1234 |

## Características

- Descubrimiento de películas y series con datos en tiempo real de TMDB
- Filtros por género y paginación
- Buscador con debounce y resultados instantáneos
- Modal con trailer de YouTube y sistema de peticiones
- Autenticación completa con JWT y roles (USER / ADMIN)
- Panel de administración para gestionar peticiones
- Perfil de usuario editable
- Landing page con acceso demo sin registro
- Deploy en Vercel (frontend) y Railway (backend + PostgreSQL)

## Stack tecnológico

### Frontend
- React 18 + TypeScript
- Vite
- Tailwind CSS
- React Router DOM
- Axios
- React Hot Toast

### Backend
- Node.js + Express + TypeScript
- Prisma ORM
- PostgreSQL
- JWT + bcryptjs

### APIs externas
- TMDB API (películas y series)
- YouTube (trailers embebidos)

## Estructura del proyecto

    seerr/
    ├── frontend/          # Aplicación React
    │   ├── src/
    │   │   ├── components/
    │   │   ├── context/
    │   │   ├── hooks/
    │   │   ├── pages/
    │   │   ├── services/
    │   │   └── types/
    └── backend/           # API REST Node.js
        ├── prisma/
        └── src/
            ├── controllers/
            ├── middlewares/
            ├── routes/
            └── types/

## Instalación local

### Requisitos
- Node.js 18+
- PostgreSQL

### Frontend

    cd frontend
    npm install
    cp .env.example .env
    npm run dev

### Backend

    cd backend
    npm install
    cp .env.example .env
    npx prisma migrate dev
    npm run dev

### Variables de entorno

**frontend/.env**

    VITE_TMDB_API_KEY=tu_api_key_de_tmdb
    VITE_TMDB_BASE_URL=https://api.themoviedb.org/3
    VITE_TMDB_IMAGE_URL=https://image.tmdb.org/t/p

**backend/.env**

    PORT=4000
    DATABASE_URL=postgresql://usuario:contraseña@localhost:5432/seerr
    JWT_SECRET=tu_clave_secreta

## Autor

Adrián Carrasco Fernández
