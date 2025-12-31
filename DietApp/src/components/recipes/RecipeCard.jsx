export default function RecipeCard({ recipe }) {
  if (!recipe) return null;
  return (
    <div className="recipe-card">
      <div className="card">
        <h2>{recipe.nombre}</h2>
        <ul>
          {recipe.ingredientes.map((ing, i) => (
            <li key={i}>
              {ing.cantidad} {ing.medida} {ing.ingrediente}
            </li>
          ))}
        </ul>
        <ul>
          {recipe.preparacion.map((ins, j) => (
            <li key={j}>{ins}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}
