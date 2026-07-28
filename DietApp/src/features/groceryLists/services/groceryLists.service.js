import { parseSuccess } from '../../../utils/errorHandler.js';

export const getAllRecipes = async () => {
  const response = await fetch('/api/recipes');
  return parseSuccess(response);
};
