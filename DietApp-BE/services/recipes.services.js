//Logic to read the recipes data from the json file and return it as json
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));

export const getAllRecipes = async () => {
  const recipesPath = path.join(__dirname, '../data/recipes.json');
  const data = await fs.readFile(recipesPath, 'utf8');
  const json = JSON.parse(data);
  return json.recetas;
};