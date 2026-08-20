import { Router } from 'express';
import {
	getMealPlan,
	upsertMealPlan,
	searchMealPlanRecipes,
} from '../controllers/mealPlans.controller.js';
import { authenticateToken } from '../middleware/auth.middleware.js';

const router = Router();

router.get('/recipes/search', authenticateToken, searchMealPlanRecipes);
router.get('/', authenticateToken, getMealPlan);
router.put('/', authenticateToken, upsertMealPlan);

export default router;
