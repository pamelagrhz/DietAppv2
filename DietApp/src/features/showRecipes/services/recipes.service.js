import { parseSuccess } from '../../../utils/errorHandler.js';

export const getRecipes = async () => {
    const response = await fetch('/api/recipes');
    return parseSuccess(response);
}

export const getIngredients = async (query = '') => {
    const searchParams = new URLSearchParams();
    if (query.trim()) {
        searchParams.set('q', query.trim());
    }

    const endpoint = searchParams.toString()
        ? `/api/ingredients?${searchParams.toString()}`
        : '/api/ingredients';

    const response = await fetch(endpoint);
    return parseSuccess(response);
};

export const createRecipe = async (recipeData) => {
    const response = await fetch('/api/recipes', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(recipeData),
    });

    return parseSuccess(response);
};

export const getRecipeTypes = async () => {
    const response = await fetch('/api/recipe-types');
    return parseSuccess(response);
};
