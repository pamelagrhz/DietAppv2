import { useEffect, useState } from 'react'
import './App.css'
import Recipes from './features/recipes/components/Recipes';


function App() {
  const [count, setCount] = useState(0)
  return (
    <>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          useState for a counter {count}
        </button>
        <Recipes/> 
      </div>
    </>
  )
}

export default App
