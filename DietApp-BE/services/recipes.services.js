//Logic to read the recipes data from the json file
//And return the recipes from the json file
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
const DATA_PATH = './data/recipes.json';


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

export async function addRecipe(nuevaReceta) {
  const data = JSON.parse(await fs.readFile(DATA_PATH, 'utf-8'));
  // Add the new recipe to the existing recipes array (in json case)
  data.recetas.push(nuevaReceta);
  //DATA_PATH es la ruta del archivo JSON donde se almacenan las recetas, y se escribe el nuevo contenido con la receta agregada
  await fs.writeFile(DATA_PATH, JSON.stringify(data, null, 2));
  return nuevaReceta;
}