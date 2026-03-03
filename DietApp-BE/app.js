//Configure express and middlewares
import express from 'express';
import cors from 'cors';
import recipesRoutes from './routes/recipes.routes.js';

const app = express();

app.use(cors());
app.use(express.json());

//all the recipes routes will be prefixed with /recipes
//use routes/recipes.routes.js for all the endpoints related to recipes
app.use('/recipes', recipesRoutes);

export default app;