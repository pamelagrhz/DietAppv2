import RecipeReviewCard from './RecipeCard.jsx';

export default function RecipeList({ recipes }) {

  //styles
  const recipeCardsStyle = {
    display: 'flex',
    //Wrap to next line if there are too many cards to fit in one row
    flexWrap: 'wrap',
    gap: '16px',
    alignItems: 'flex-start',
  };

  return (
    <div style={recipeCardsStyle}>
      {Array.isArray(recipes) && recipes.map((recipe, idx) => (
      <RecipeReviewCard key={idx} recipe={recipe} />
))}
    </div>
  );
}

