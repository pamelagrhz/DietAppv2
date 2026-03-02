import { useEffect, useState } from 'react'
import './App.css'
import Recipes from './components/recipes/RecipeList';
import { api } from './assets/api';


function App() {
  const [count, setCount] = useState(0)
  //Crear un useState para guardar los datos de la API
  const [apiData, setApiData] = useState({});

  //hook use effect para hacer la petición a la API y guardar los datos en el estado
  useEffect(() => {
    api().then(data => {
      setApiData(data);
    })
  }, []);
  return (
    <>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          useState for a counter {count}
        </button>
        <Recipes recipes={apiData} /> 
      </div>
    </>
  )
}

export default App
