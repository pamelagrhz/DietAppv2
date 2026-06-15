import pool from '../db.js';

const getAllRecipeTypes = async () => {
  const [rows] = await pool.query(
    `
      SELECT name AS recipeType
      FROM recipe_types
      ORDER BY name ASC
    `
  );

  return rows
    .map((row) => row.recipeType)
    .filter((type) => typeof type === 'string');
};

export default  getAllRecipeTypes;  