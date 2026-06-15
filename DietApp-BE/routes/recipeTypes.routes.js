import { Router } from 'express';
import { listRecipeTypes } from '../controllers/recipeTypes.controller.js';  

const router = Router();

router.get('/recipe-types', listRecipeTypes);

export default router;
