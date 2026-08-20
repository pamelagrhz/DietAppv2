//Define recipes routes
import { Router } from 'express';
import { getRecipes } from '../controllers/recipes.controller.js';
import { createRecipe } from '../controllers/recipes.controller.js';
import { authenticateToken } from '../middleware/auth.middleware.js';
import { requireRole } from '../middleware/role.middleware.js';

const router = Router();
//Endpoint to get all recipes
router.get('/', authenticateToken, getRecipes);
router.post('/', authenticateToken, requireRole('colaborador'), createRecipe);

export default router;