import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import RecipeList from './components/recipes/RecipeList'
import recipe from './data/recipes.json'


function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count w useState is {count}
        </button>
        <RecipeList  recipes={recipe}/>
      </div>
    </>
  )
}

export default App
