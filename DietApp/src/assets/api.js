//Crear una función asíncrona que haga una petición a la API y devuelva los datos en formato JSON
export const api = async() => {
    const response = await fetch('http://localhost:3000');
    const data = response.json();
    return data;
}