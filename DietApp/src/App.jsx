import { useState } from 'react'
import { Navigate, Route, Routes, useNavigate } from 'react-router-dom';
import './App.css'
import Recipes from './features/showRecipes/pages/Recipes.jsx';
import AppHeader from './features/addRecipes/createRecipeModal.jsx';
import HeaderMenu from './components/headerMenu.jsx';


function App() {
  const [isCreateRecipeOpen, setCreateRecipeOpen] = useState(false);
  const navigate = useNavigate();

  const handleMenuOptionClick = (action) => {
    if (action === 'newRecipe') {
      setCreateRecipeOpen(true);
    }
    if (action === 'recipes') {
      navigate('/recipes');
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
        <Routes>
          <Route path="/" element={<Navigate to="/recipes" replace />} />
          <Route path="/recipes" element={<Recipes />} />
        </Routes>
      </div>
    </>
  )
}

export default App
