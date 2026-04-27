//Define recipes routes
import { Router } from 'express';
import { getRecipes } from '../controllers/recipes.controller.js';
import { createRecipe } from '../controllers/recipes.controller.js';

const router = Router();
//Endpoint to get all recipes
router.get('/', getRecipes);
router.post('/', createRecipe);

export default router;