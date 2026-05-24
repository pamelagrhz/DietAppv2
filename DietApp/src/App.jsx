import { useState } from 'react'
import { Navigate, Route, Routes, useNavigate } from 'react-router-dom';
import './App.css'
import Recipes from './features/showRecipes/pages/Recipes.jsx';
import HeaderMenu from './components/headerMenu.jsx';
import CreateRecipe from './features/addRecipes/CreateRecipe.jsx';
import MealPlans from './features/mealPlans/pages/MealPlans.jsx';


function App() {
  const navigate = useNavigate();

  const handleMenuOptionClick = (action) => {
    if (action === 'newRecipe') {
      navigate('/new-recipe');
    }
    if (action === 'recipes') {
      navigate('/recipes');
    }
    if (action === 'mealPlans') {
      navigate('/meal-plans');
    }
  };

  return (
    <>
            <HeaderMenu onMenuOptionClick={handleMenuOptionClick} />

      <div className="card">
        
        <Routes>
          <Route path="/" element={<Navigate to="/recipes" replace />} />
          <Route path="/recipes" element={<Recipes />} />
          <Route path="/new-recipe" element={<CreateRecipe />} />
          <Route path="/meal-plans" element={<MealPlans />} />
        </Routes>
      </div>
    </>
  )
}

export default App
