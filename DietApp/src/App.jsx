import { useEffect, useState } from 'react'
import './App.css'
import RecipeList from './components/recipes/RecipeList'
import recipe from './data/recipes.json'
import { api } from './assets/api';


function App() {
  const [count, setCount] = useState(0)
  //Crear un useState para guardar los datos de la API
  const [apiData, setApiData] = useState('');

  //hook use effect para hacer la petición a la API y guardar los datos en el estado
  useEffect(() => {
    api().then(data => {
      setApiData(data.recetas);
    })
  }, []);

  return (
    <>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          useState for a counter {count}
        </button>
        <h2>Recetas para {recipe.personas} persona(s) de: {recipe.porcion_base_KG} kg</h2>
       <RecipeList  recipes={recipe}/>{/* Cambiar a apiData */}
      </div>
    </>
  )
}

export default App
