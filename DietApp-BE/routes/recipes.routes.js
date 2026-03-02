//Define recipes routes
import { Router } from 'express';
import { getRecipes } from '../controllers/recipes.controller.js';

const router = Router();

router.get('/', getRecipes);

export default router;