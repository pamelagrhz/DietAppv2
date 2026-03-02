export default function Recipes({ recipes }) {
    return(

        <>
        <h2>
          {recipes.personas && recipes.porcion_base_KG
            ? `Recetas para ${recipes.personas} persona(s) de: ${recipes.porcion_base_KG} kg`
            : 'Cargando datos...'}
        </h2>
       <RecipeList  recipes={recipes}/>{/* Cambiar a apiData */}
       </>
    )
}