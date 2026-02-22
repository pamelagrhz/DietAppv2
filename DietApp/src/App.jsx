import { useEffect, useState } from 'react'
import './App.css'
import RecipeList from './components/recipes/RecipeList'
import recipe from './data/recipes.json'
import { api } from './assets/api';


function App() {
  const [count, setCount] = useState(0)

  //hook use effect para hacer la petición a la API y guardar los datos en el estado
  useEffect(() => {
    api().then(data => {
      console.log(data);
    })
  }, []);

  return (
    <>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          useState for a counter {count}
        </button>
        <RecipeList  recipes={recipe}/>
      </div>
    </>
  )
}

export default App
