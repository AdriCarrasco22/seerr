import { Router } from 'express'
import {
  createRequest,
  getMyRequests,
  getAllRequests,
  updateRequestStatus,
  deleteRequest,
} from '../controllers/requests.controller'
import { authenticate, requireAdmin } from '../middlewares/auth'

const router = Router()

// Todas las rutas requieren estar autenticado
router.use(authenticate)

router.post('/', createRequest)
router.get('/my', getMyRequests)
router.get('/', requireAdmin, getAllRequests)
router.patch('/:id/status', requireAdmin, updateRequestStatus)
router.delete('/:id', deleteRequest)

export default router