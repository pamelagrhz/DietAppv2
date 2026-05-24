//Configure express and middlewares
import express from 'express';
import cors from 'cors'; 
import recipesRoutes from './routes/recipes.routes.js';
import ingredientsRoutes from './routes/ingredients.routes.js';
import mealPlansRoutes from './routes/mealPlans.routes.js';

const app = express();

app.use(cors({
  origin: 'http://localhost:5173'
})); // Enable CORS for only the frontend origin (adjust if your frontend runs on a different port)
app.use(express.json()); // Middleware to parse JSON bodies

//all the recipes routes will be prefixed with /recipes
//use routes/recipes.routes.js for all the endpoints related to recipes
app.use('/recipes', recipesRoutes);
app.use('/ingredients', ingredientsRoutes);
app.use('/meal-plans', mealPlansRoutes);

export default app;