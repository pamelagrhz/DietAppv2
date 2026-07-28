import sendSuccess from '../utils/response.js';
import { getIngredients } from '../services/ingredients.services.js';

export const listIngredients = async (req, res, next) => {
	try {
		const { q = '' } = req.query;
		const ingredients = await getIngredients(q);
		sendSuccess(res, ingredients);
	} catch (error) {
		next(error);
	}
};
