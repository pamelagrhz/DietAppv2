import { getIngredients } from '../services/ingredients.services.js';

export const listIngredients = async (req, res) => {
	try {
		const { q = '' } = req.query;
		const ingredients = await getIngredients(q);
		res.json(ingredients);
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
};
