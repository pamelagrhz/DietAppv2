import { Router } from 'express';
import { login, register, refresh, logout, checkUsername } from '../controllers/auth.controller.js';

const router = Router();

router.post('/login', login);
router.post('/register', register);
router.post('/refresh', refresh);
router.post('/logout', logout);
router.get('/check-username', checkUsername);

export default router;
