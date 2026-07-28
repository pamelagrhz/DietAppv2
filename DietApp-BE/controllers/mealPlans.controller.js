import AppError from '../utils/AppError.js';
import sendSuccess from '../utils/response.js';
import {
  getMealPlanWeek,
  saveMealPlanWeek,
  searchRecipesByNameAndType,
} from '../services/mealPlans.services.js';

export const getMealPlan = async (req, res, next) => {
  try {
    const { userId = 'pamelagrhz', page = '1' } = req.query;
    const mealPlan = await getMealPlanWeek({
      userId: String(userId),
      page: Number(page),
    });
    sendSuccess(res, mealPlan);
  } catch (error) {
    next(error);
  }
};

export const upsertMealPlan = async (req, res, next) => {
  try {
    const { userId = 'pamelagrhz', page = 1, days, weekSections = {} } = req.body ?? {};

    if (!Array.isArray(days)) {
      throw new AppError(400, 'MISSING_MEAL_PLAN_DAYS', 'Meal plan days are required');
    }

    const savedPlan = await saveMealPlanWeek({
      userId: String(userId),
      page: Number(page),
      days,
      weekSections,
    });

    sendSuccess(res, savedPlan);
  } catch (error) {
    next(error);
  }
};

export const searchMealPlanRecipes = async (req, res, next) => {
  try {
    const { q = '', type = '' } = req.query;
    const results = await searchRecipesByNameAndType(String(q), String(type));
    sendSuccess(res, results);
  } catch (error) {
    next(error);
  }
};
