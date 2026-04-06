import RecipeCard from './RecipeCard';

export default function RecipeList({ recipes }) {
  return (
    <>
      {Array.isArray(recipes) && recipes.map((recipe, idx) => (
      <RecipeCard key={idx} recipe={recipe} />
))}
    </>
  );
}

