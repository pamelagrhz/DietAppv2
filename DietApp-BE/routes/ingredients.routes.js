import { Router } from 'express';
import { listIngredients } from '../controllers/ingredients.controller.js';

const router = Router();

router.get('/', listIngredients);

export default router;
