import { useEffect, useState } from 'react'
import './App.css'
import Recipes from './features/showRecipes/pages/Recipes.jsx';
import AppHeader from './components/appHeader.jsx';
import AnchorTemporaryDrawer from './components/anchorTemporaryDrawer.jsx';


function App() {
  const [count, setCount] = useState(0)
  return (
    <>
      <div className="card">
        {/* <button onClick={() => setCount((count) => count + 1)}>
          useState for a counter {count}
        </button> */}
        <AppHeader/>
        <AnchorTemporaryDrawer/>
        <Recipes/> 
      </div>
    </>
  )
}

export default App
