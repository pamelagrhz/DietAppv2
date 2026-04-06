export default function IngredientsList({ ingredients }) {
    //TODO: change to table format
    return(
        <ul>
          {ingredients.map((ing, i) => (
            <li key={i}>
              {ing.cantidad} - {ing.medida} : {ing.ingrediente}
            </li>
          ))}
        </ul>
    )
}