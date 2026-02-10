import { useState } from 'react'
import './App.css'
import RecipeList from './components/recipes/RecipeList'
import recipe from './data/recipes.json'


function App() {
  const [count, setCount] = useState(0)

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
