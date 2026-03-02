//Crear una función asíncrona que haga una petición a la API y devuelva los datos en formato JSON
export const api = async () => {
    const response = await fetch('http://localhost:3000/recipes');
    if (!response.ok) {
        throw new Error('No se pudieron obtener las recetas');
    }
    const data = await response.json();
    return data;
}