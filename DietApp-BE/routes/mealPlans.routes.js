import { Router } from 'express';
import {
	getMealPlan,
	upsertMealPlan,
	searchMealPlanRecipes,
} from '../controllers/mealPlans.controller.js';

const router = Router();

router.get('/recipes/search', searchMealPlanRecipes);
router.get('/', getMealPlan);
router.put('/', upsertMealPlan);

export default router;
