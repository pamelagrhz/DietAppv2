import { useEffect, useState } from 'react'
import { api } from '../services/api';
import RecipeList from './RecipeList';

export default function Recipes() {
    const [count, setCount] = useState(0)
  //Crear un useState para guardar los datos de la API
  const [apiData, setApiData] = useState({});

  //hook use effect para hacer la petición a la API y guardar los datos en el estado
  useEffect(() => {
    api().then(data => {
      setApiData(data);
      console.log('Respuesta de la API en Recipes.jsx:', data);
    })
  }, []);

  return (
    <>
      <h2>
        {apiData.personas !== undefined && apiData.porcion_base_KG !== undefined
          ? `Recetas para ${apiData.personas} persona(s) de: ${apiData.porcion_base_KG} kg`
          : 'Cargando datos...'}
      </h2>
      <RecipeList recipes={apiData.recetas || []} />
    </>
  );
}