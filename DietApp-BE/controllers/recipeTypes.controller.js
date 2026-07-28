import sendSuccess from '../utils/response.js';
import getAllRecipeTypes from '../services/recipeTypes.services.js';

export const listRecipeTypes = async (req, res, next) => {
  try {
    const recipeTypes = await getAllRecipeTypes();
    sendSuccess(res, recipeTypes);
  } catch (error) {
    next(error);
  }
};
