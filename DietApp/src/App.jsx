import { useState } from 'react'
import './App.css'
import Recipes from './features/showRecipes/pages/Recipes.jsx';
import AppHeader from './components/appHeader.jsx';
import AnchorTemporaryDrawer from './components/anchorTemporaryDrawer.jsx';


function App() {
  const [isCreateRecipeOpen, setCreateRecipeOpen] = useState(false);

  const handleMenuOptionClick = (action) => {
    if (action === 'newRecipe') {
      setCreateRecipeOpen(true);
    }
  };

  return (
    <>
      <div className="card">
        <AppHeader
          open={isCreateRecipeOpen}
          onOpen={() => setCreateRecipeOpen(true)}
          onClose={() => setCreateRecipeOpen(false)}
        />
        <AnchorTemporaryDrawer onMenuOptionClick={handleMenuOptionClick} />
        <Recipes/> 
      </div>
    </>
  )
}

export default App
