import { Router } from 'express';
import { getUserProfile, updateUserPassword } from '../controllers/users.controller.js';
import { authenticateToken } from '../middleware/auth.middleware.js';
import { requireOwnerOrAdmin } from '../middleware/role.middleware.js';

const router = Router();

router.get('/:username', authenticateToken, requireOwnerOrAdmin('username'), getUserProfile);
router.put('/:username/password', authenticateToken, requireOwnerOrAdmin('username'), updateUserPassword);

export default router;
