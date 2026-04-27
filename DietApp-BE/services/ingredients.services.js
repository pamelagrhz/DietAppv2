import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

// define __dirname like in commonjs, to be able to use it in the path of the json file
const __dirname = dirname(fileURLToPath(import.meta.url));

export const getIngredients = async (search = '') => {
    //read recipes json
    const ingredientsPath = path.join(__dirname, '../data/recipes.json');
    const data = await fs.readFile(ingredientsPath, 'utf8');
    const json = JSON.parse(data);

    const normalizedSearch = search.trim().toLowerCase();
    // Extract ingredients from all recipes, flatten the array, and filter by search query if provided
    return (json.recetas || [])
        .flatMap((recipe) => recipe.ingredientes || [])
        .map((item) => item?.ingrediente)
        .filter((ingredient) => typeof ingredient === 'string')
        .filter((ingredient) =>
            normalizedSearch ? ingredient.toLowerCase().includes(normalizedSearch) : true
        );
};