import RecipeAcordion from './RecipeAcordion.jsx';

export default function RecipeList({ recipes }) {
  return (
    <>
      {Array.isArray(recipes) && recipes.map((recipe, idx) => (
      <RecipeAcordion key={idx} recipe={recipe} />
))}
    </>
  );
}

