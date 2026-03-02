import RecipeCard from './RecipeCard';

export default function RecipeList({ recipes }) {
  return (
    <>
     <h2>
          {`Recetas para ${recipes.personas} persona(s) de: ${recipes.porcion_base_KG} kg`}
        </h2>
      {Array.isArray(recipes) && recipes.map((recipe, idx) => (
      <RecipeCard key={idx} recipe={recipe} />
))}
    </>
  );
}

