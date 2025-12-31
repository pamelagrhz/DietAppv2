import RecipeCard from './RecipeCard';

export default function RecipeList({ recipes }) {
  return (
    <>
      <h1>Recipes:</h1>
      {recipes.recetas.map((recipe, idx) => (
        <RecipeCard key={idx} recipe={recipe} />
      ))}
    </>
  );
}

