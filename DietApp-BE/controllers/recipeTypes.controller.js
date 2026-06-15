import getAllRecipeTypes from '../services/recipeTypes.services.js';

export const listRecipeTypes = async (req, res) => {
  try {
    const recipeTypes = await getAllRecipeTypes();
    res.json(recipeTypes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};