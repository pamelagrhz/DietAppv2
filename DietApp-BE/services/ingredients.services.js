import pool from '../db.js';

export const getIngredients = async (search = '') => {
    const normalizedSearch = String(search || '').trim().toLowerCase();

    const [rows] = await pool.query(
        `
            SELECT nombre AS ingrediente
            FROM ingredients
            WHERE (? = '' OR LOWER(nombre) LIKE CONCAT('%', ?, '%'))
            ORDER BY nombre ASC
        `,
        [normalizedSearch, normalizedSearch]
    );

    return rows
        .map((row) => row.ingrediente)
        .filter((ingredient) => typeof ingredient === 'string');
};