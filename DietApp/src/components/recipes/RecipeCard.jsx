import IngredientsList from "./IngredientsTable";
import InstructionsList from "./InstructionsList";

export default function RecipeCard({ recipe }) {

  // TODO: Add state to show/hide recipe information
  // TODO: Add image to recipe card

  const recipeCard = {
    border: '1px solid #ccc',
    borderRadius: '8px',
    marginBottom: '16px',
    backgroundColor: '#f9f9f9',
  }
  const cardContent = {}
  const cardTitle = {
    margin: '18px',
    fontSize: '1.5em',
    marginBottom: '8px',
    color: '#133f9c',
  }

  if (!recipe) return null;
  return (
    <div style={recipeCard}>
      <div style={cardContent}>
        {/* TODO: Insert image */}
        <h2 style={cardTitle}>{recipe.nombre}</h2>
        {/* <IngredientsList ingredients={recipe.ingredientes} /> */}
         {/* <InstructionsList instructions={recipe.preparacion} /> */}
      </div>
    </div>
  );
}
