import {
  getMealPlanWeek,
  saveMealPlanWeek,
  searchRecipesByNameAndType,
} from '../services/mealPlans.services.js';

export const getMealPlan = async (req, res) => {
  try {
    const { userId = 'pamelagrhz', page = '1' } = req.query;
    const mealPlan = await getMealPlanWeek({
      userId: String(userId),
      page: Number(page),
    });
    res.json(mealPlan);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const upsertMealPlan = async (req, res) => {
  try {
    const { userId = 'pamelagrhz', page = 1, days } = req.body ?? {};

    if (!Array.isArray(days)) {
      return res.status(400).json({ error: 'Debes enviar el plan semanal en days.' });
    }

    const savedPlan = await saveMealPlanWeek({
      userId: String(userId),
      page: Number(page),
      days,
    });

    res.status(200).json(savedPlan);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const searchMealPlanRecipes = async (req, res) => {
  try {
    const { q = '', type = '' } = req.query;
    const results = await searchRecipesByNameAndType(String(q), String(type));
    res.json(results);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
