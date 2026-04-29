import { useState } from 'react'
import { Navigate, Route, Routes, useNavigate } from 'react-router-dom';
import './App.css'
import Recipes from './features/showRecipes/pages/Recipes.jsx';
import HeaderMenu from './components/headerMenu.jsx';
import CreateRecipe from './features/addRecipes/CreateRecipe.jsx';


function App() {
  const navigate = useNavigate();

  const handleMenuOptionClick = (action) => {
    if (action === 'newRecipe') {
      navigate('/new-recipe');
    }
    if (action === 'recipes') {
      navigate('/recipes');
    }
  };

  return (
    <>
            <HeaderMenu onMenuOptionClick={handleMenuOptionClick} />

      <div className="card">
        
        <Routes>
          <Route path="/" element={<Navigate to="/recipes" replace />} />
          <Route path="/recipes" element={<Recipes />} />
          //TODO: add route for create recipe page
          <Route path="/new-recipe" element={<CreateRecipe />} />
        </Routes>
      </div>
    </>
  )
}

export default App
