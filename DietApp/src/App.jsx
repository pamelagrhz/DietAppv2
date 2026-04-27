import { useState } from 'react'
import './App.css'
import Recipes from './features/showRecipes/pages/Recipes.jsx';
import AppHeader from './features/addRecipes/createRecipeModal.jsx';
import HeaderMenu from './components/headerMenu.jsx';


function App() {
  const [isCreateRecipeOpen, setCreateRecipeOpen] = useState(false);

  const handleMenuOptionClick = (action) => {
    if (action === 'newRecipe') {
      setCreateRecipeOpen(true);
    }
  };

  return (
    <>
            <HeaderMenu onMenuOptionClick={handleMenuOptionClick} />

      <div className="card">
        <AppHeader
          open={isCreateRecipeOpen}
          onOpen={() => setCreateRecipeOpen(true)}
          onClose={() => setCreateRecipeOpen(false)}
        />
        <Recipes/> 
      </div>
    </>
  )
}

export default App
