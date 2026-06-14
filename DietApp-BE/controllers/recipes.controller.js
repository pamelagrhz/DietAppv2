//Recipes get to return the recipes data from the json file
//Controller to endpoint /recipes
import { getAllRecipes, addRecipe } from '../services/recipes.services.js'

const ALLOWED_RECIPE_TYPES = new Set(['comida', 'sopa', 'complemento', 'otro']);

export const getRecipes = async (req, res) => {
  try {
    const recipes = await getAllRecipes();
    res.json(recipes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const createRecipe = async (req, res) => {
  try {
    const { nombre, ingredientes, preparacion, porciones, userId, score, recipeType = 'comida' } = req.body ?? {};
    const parsedPorciones = Number(porciones ?? 1);
    const parsedScore = Number(score ?? 0);
    const normalizedPreparation = typeof preparacion === 'string' ? preparacion.trim() : '';
    const normalizedRecipeType = String(recipeType || 'comida').trim().toLowerCase();

    if (
      !nombre?.trim() ||
      !userId?.trim() ||
      !Array.isArray(ingredientes) ||
      ingredientes.length < 1 ||
      !normalizedPreparation ||
      Number.isNaN(parsedPorciones) ||
      parsedPorciones < 1 ||
      Number.isNaN(parsedScore) ||
      parsedScore < 0 ||
      parsedScore > 5 ||
      !ALLOWED_RECIPE_TYPES.has(normalizedRecipeType)
    ) {
      return res.status(400).json({ error: 'Datos de receta inválidos' });
    }

    const hasInvalidCantidad = ingredientes.some((ing) => {
      const cantidadNumerica = Number(ing?.cantidad);
      return Number.isNaN(cantidadNumerica) || cantidadNumerica < 0;
    });

    if (hasInvalidCantidad) {
      return res.status(400).json({ error: 'Cantidad de ingrediente inválida' });
    }

    const ingredientesNormalizados = ingredientes.map((ing) => {
      const cantidadNumerica = Number(ing.cantidad);
      const cantidadPorPorcion = parsedPorciones > 1
        ? Number((cantidadNumerica / parsedPorciones).toFixed(4))
        : cantidadNumerica;

      return {
        ...ing,
        cantidad: cantidadPorPorcion,
      };
    });

    const nuevaReceta = {
      nombre: nombre.trim(),
      userId: userId.trim(),
      creationDate: new Date().toISOString(),
      lastModifiedDate: new Date().toISOString(), 
      score: Number(parsedScore.toFixed(2)),
      recipeType: normalizedRecipeType,
      ingredientes: ingredientesNormalizados,
      preparacion: normalizedPreparation,
    };

    //Call the addRecipe function from recipes.services.js to make a push to the json file with the new recipe
    const recetaAgregada = await addRecipe(nuevaReceta);
    res.status(201).json(recetaAgregada);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};