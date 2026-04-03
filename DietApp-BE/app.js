//Configure express and middlewares
import express from 'express';
import cors from 'cors'; 
import recipesRoutes from './routes/recipes.routes.js';
import ingredientsRoutes from './routes/ingredients.routes.js';

const app = express();

app.use(cors()); // Enable CORS for all routes
app.use(express.json()); // Middleware to parse JSON bodies

//all the recipes routes will be prefixed with /recipes
//use routes/recipes.routes.js for all the endpoints related to recipes
app.use('/recipes', recipesRoutes);
app.use('/ingredients', ingredientsRoutes);

export default app;