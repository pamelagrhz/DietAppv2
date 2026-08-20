import { Router } from 'express';
import { listIngredients } from '../controllers/ingredients.controller.js';
import { authenticateToken } from '../middleware/auth.middleware.js';

const router = Router();

router.get('/', authenticateToken, listIngredients);

export default router;
