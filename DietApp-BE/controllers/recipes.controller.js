//Recipes get to return the recipes data from the json file
//Controller to endpoint /recipes
import { getAllRecipes } from '../services/recipes.services.js'

export const getRecipes = async (req, res) => {
  try {
    const recipes = await getAllRecipes();
    res.json(recipes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};