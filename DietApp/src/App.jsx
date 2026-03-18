import { useEffect, useState } from 'react'
import './App.css'
import Recipes from './features/recipes/pages/Recipes';
import AppHeader from './components/appHeader';


function App() {
  const [count, setCount] = useState(0)
  return (
    <>
      <div className="card">
        {/* <button onClick={() => setCount((count) => count + 1)}>
          useState for a counter {count}
        </button> */}
        <AppHeader/>
        <Recipes/> 
      </div>
    </>
  )
}

export default App
