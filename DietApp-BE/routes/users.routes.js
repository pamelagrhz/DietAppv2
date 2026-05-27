import { Router } from 'express';
import { getUserProfile, updateUserPassword } from '../controllers/users.controller.js';

const router = Router();

router.get('/:username', getUserProfile);
router.put('/:username/password', updateUserPassword);

export default router;
