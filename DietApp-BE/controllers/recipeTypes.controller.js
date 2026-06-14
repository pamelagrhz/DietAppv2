import getRecipesData from '../data/recipes.json';

export const getAllRecipes = async () => {
  return getRecipesData;
};

export const addRecipe = async (recipe) => {
  // This is a placeholder function. In a real application, you would save the recipe to a database.
  // For now, it just returns the recipe that was passed in.
  return recipe;
}