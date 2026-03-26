//Recipes get to return the recipes data from the json file
//Controller to endpoint /recipes
import { getAllRecipes, addRecipe } from '../services/recipes.services.js'

export const getRecipes = async (req, res) => {
  try {
    const recipes = await getAllRecipes();
    res.json(recipes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const createRecipe = async (req, res) => {
  try {
    const nuevaReceta = req.body;
    //Call the addRecipe function from recipes.services.js to make a push to the json file with the new recipe
    const recetaAgregada = await addRecipe(nuevaReceta);
    res.status(201).json(recetaAgregada);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};