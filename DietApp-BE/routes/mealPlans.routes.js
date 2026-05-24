import { Router } from 'express';
import { getMealPlan, upsertMealPlan } from '../controllers/mealPlans.controller.js';

const router = Router();

router.get('/', getMealPlan);
router.put('/', upsertMealPlan);

export default router;
