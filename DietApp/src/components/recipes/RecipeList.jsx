import recipesData from '../../data/recipes.json'

export default function RecipeList({ recipes }) {
    return (
    <>
        <h1>Recipes:</h1>
        <ShowRecipes recipes={recipes.recetas} />
    </>
  )
}