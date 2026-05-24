import { getWeeklyMealPlan, saveWeeklyMealPlan } from '../services/mealPlans.services.js';

export const getMealPlan = async (req, res) => {
  try {
    const { userId = 'pamelagrhz' } = req.query;
    const mealPlan = await getWeeklyMealPlan(String(userId));
    res.json(mealPlan);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const upsertMealPlan = async (req, res) => {
  try {
    const { userId = 'pamelagrhz', days } = req.body ?? {};

    if (!Array.isArray(days)) {
      return res.status(400).json({ error: 'Debes enviar el plan semanal en days.' });
    }

    const savedPlan = await saveWeeklyMealPlan({
      userId: String(userId),
      days,
    });

    res.status(200).json(savedPlan);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
