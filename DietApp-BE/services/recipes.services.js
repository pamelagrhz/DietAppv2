//Logic to read the recipes data from the json file
//And return the recipes from the json file
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));

export const getAllRecipes = async () => {
    //make a Join to the path of the json file and read the data from the json file
    const recipesPath = path.join(__dirname, '../data/recipes.json');
    // Use file system to read the data from the json file and return the recipes
    const data = await fs.readFile(recipesPath, 'utf8');
    //Make a parse to the data and return the recipes
    const json = JSON.parse(data);
    return json.recetas;
};