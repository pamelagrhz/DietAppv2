import { Router } from 'express';
import { listRecipeTypes } from '../controllers/recipeTypes.controller.js';
import { authenticateToken } from '../middleware/auth.middleware.js';

const router = Router();

router.get('/', authenticateToken, listRecipeTypes);

export default router;
