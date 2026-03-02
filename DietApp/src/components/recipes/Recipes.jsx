import { useEffect, useState } from 'react';
import { api } from '../../assets/api';
import RecipeList from './RecipeList';

export default function Recipes() {
  const [recipesData, setRecipesData] = useState({});

  useEffect(() => {
    api().then(data => {
      console.log('Respuesta de la API en Recipes.jsx:', data);
      setRecipesData(data);
    });
  }, []);

  return (
    <>
      <h2>
        {recipesData.personas !== undefined && recipesData.porcion_base_KG !== undefined
          ? `Recetas para ${recipesData.personas} persona(s) de: ${recipesData.porcion_base_KG} kg`
          : 'Cargando datos...'}
      </h2>
      <RecipeList recipes={recipesData.recetas || []} />
    </>
  );
}