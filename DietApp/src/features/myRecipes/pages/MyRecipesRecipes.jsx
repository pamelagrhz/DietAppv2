import { useEffect, useState } from 'react';
import RecipeList from '../../showRecipes/components/RecipeList.jsx';
import { getRecipes } from '../../showRecipes/services/recipes.service.js';
import { getProfileByUsername } from '../../profile/services/profile.service.js';

const PROFILE_USERNAME = 'pamelagrhz'; // TODO: Replace with dynamic username from auth context or similar mechanism

export default function MyRecipesRecipes() {
  const [recipes, setRecipes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadUserRecipes = async () => {
      try {
        setIsLoading(true);
        setError('');

        const [user, allRecipes] = await Promise.all([
          getProfileByUsername(PROFILE_USERNAME),
          getRecipes(),
        ]);

        const username = user?.username || PROFILE_USERNAME;
        const filteredRecipes = Array.isArray(allRecipes)
          ? allRecipes.filter((recipe) => recipe?.userId === username)
          : [];

        setRecipes(filteredRecipes);
      } catch (requestError) {
        setError(requestError.message || 'No se pudieron cargar tus recetas.');
      } finally {
        setIsLoading(false);
      }
    };

    loadUserRecipes();
  }, []);

  if (isLoading) {
    return <p>Cargando recetas...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  if (!recipes.length) {
    return <p className="my-recipes-empty">Aun no tienes recetas creadas.</p>;
  }

  return (
    <section>
      <RecipeList recipes={recipes} />
    </section>
  );
}
