import pool from "../db";

const getAllRecipeTypes = async () => {
  const [rows] = await pool.query(
    `
      SELECT DISTINCT recipe_types AS recipeType
      FROM recipes
      ORDER BY recipe_types ASC
    `
  );

  return rows
    .map((row) => row.recipeType)
    .filter((type) => typeof type === 'string');
};

export default {
  getAllRecipeTypes,
};  