import pool from '../db.js';

export const getIngredients = async (search = '') => {
    const normalizedSearch = String(search || '').trim().toLowerCase();

    const [rows] = await pool.query(
        `
            SELECT DISTINCT ingrediente
            FROM recipe_ingredients
            WHERE (? = '' OR LOWER(ingrediente) LIKE CONCAT('%', ?, '%'))
            ORDER BY ingrediente ASC
        `,
        [normalizedSearch, normalizedSearch]
    );

    return rows
        .map((row) => row.ingrediente)
        .filter((ingredient) => typeof ingredient === 'string');
};