import { Router } from 'express';
import { login, register, checkUsername } from '../controllers/auth.controller.js';

const router = Router();

router.post('/login', login);
router.post('/register', register);
router.get('/check-username', checkUsername);

export default router;
