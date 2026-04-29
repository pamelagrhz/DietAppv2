import RecipeAcordion from './RecipeAcordion.jsx';
import RecipeReviewCard from './RecipeCard.jsx';

export default function RecipeList({ recipes }) {
  return (
    <>
      {Array.isArray(recipes) && recipes.map((recipe, idx) => (
      <RecipeReviewCard key={idx} recipe={recipe} />
))}
    </>
  );
}

