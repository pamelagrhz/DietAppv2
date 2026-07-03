import { Navigate, Route, Routes, useNavigate, useLocation } from 'react-router-dom';
import './App.css'
import Recipes from './features/showRecipes/pages/Recipes.jsx';
import HeaderMenu from './components/headerMenu.jsx';
import CreateRecipe from './features/addRecipes/CreateRecipe.jsx';
import MealPlans from './features/mealPlans/pages/MealPlans.jsx';
import GroceryLists from './features/groceryLists/pages/GroceryLists.jsx';
import Profile from './features/profile/pages/Profile.jsx';
import MyRecipes from './features/myRecipes/pages/MyRecipes.jsx';
import MyRecipesRecipes from './features/myRecipes/pages/MyRecipesRecipes.jsx';
import MyRecipesFavourites from './features/myRecipes/pages/MyRecipesFavourites.jsx';
import Help from './features/help/pages/Help.jsx';
import AuthLayout from './features/auth/components/login/AuthLayout.jsx';
import Login from './features/auth/pages/login/Login.jsx';
import Register from './features/auth/pages/register/Register.jsx';
import Logout from './features/auth/pages/Logout.jsx';

function App() {
  const navigate = useNavigate();
  const location = useLocation();

  // Ocultar el menú en la pantalla de login
  const showHeader = location.pathname !== '/login' && location.pathname !== '/register';

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
    if (action === 'groceryLists') {
      navigate('/grocery-lists');
    }
    if (action === 'profile') {
      navigate('/profile');
    }
    if (action === 'myRecipes') {
      navigate('/my-recipes');
    }
    if (action === 'help') {
      navigate('/help');
    }
    if (action === 'logout') {
      navigate('/logout');
    }
  };

  return (
    <>
      {showHeader && <HeaderMenu onMenuOptionClick={handleMenuOptionClick} />}

      <div className="card">
        <Routes>
          <Route path="/" element={<Navigate to="/recipes" replace />} />

          <Route element={<AuthLayout />}>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
          </Route>

          <Route path="/logout" element={<Logout />} />
          <Route path="/recipes" element={<Recipes />} />
          <Route path="/new-recipe" element={<CreateRecipe />} />
          <Route path="/meal-plans" element={<MealPlans />} />
          <Route path="/grocery-lists" element={<GroceryLists />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/help" element={<Help />} />
          <Route path="/my-recipes" element={<MyRecipes />}>
            <Route index element={<Navigate to="recipes" replace />} />
            <Route path="recipes" element={<MyRecipesRecipes />} />
            <Route path="favourites" element={<MyRecipesFavourites />} />
          </Route>
        </Routes>
      </div>
    </>
  )
}

export default App
