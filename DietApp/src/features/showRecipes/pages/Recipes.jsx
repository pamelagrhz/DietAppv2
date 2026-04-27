import { useEffect, useState } from 'react'
import { getRecipes } from '../services/recipes.service';
import RecipeList from '../components/RecipeList.jsx';

export default function Recipes() {
  //Crear un useState para guardar los datos de la API
  const [apiData, setApiData] = useState({});

  //hook use effect para hacer la petición a la API y guardar los datos en el estado
  useEffect(() => {
    getRecipes().then(data => {
      setApiData(data);
    })
  }, []);

  return (
    <>
      <h2>
        Recetas:
      </h2>
      <RecipeList recipes={apiData} />
    </>
  );
}