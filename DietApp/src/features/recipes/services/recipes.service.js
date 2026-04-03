//Crear una función asíncrona que haga una petición a la API y devuelva los datos en formato JSON
export const getRecipes = async () => {
    const response = await fetch('/api/recipes');
    if (!response.ok) {
        throw new Error('No se pudieron obtener las recetas');
    }
    const data = await response.json();
    return data;
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
    if (!response.ok) {
        throw new Error('No se pudieron obtener los ingredientes');
    }

    return response.json();
};