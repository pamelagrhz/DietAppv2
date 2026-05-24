export const getAllRecipes = async () => {
  const response = await fetch('/api/recipes');

  if (!response.ok) {
    throw new Error('No se pudieron obtener las recetas');
  }

  return response.json();
};
