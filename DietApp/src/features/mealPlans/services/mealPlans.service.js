export const getMealPlan = async (userId = 'pamelagrhz') => {
  const query = new URLSearchParams({ userId });
  const response = await fetch(`/api/meal-plans?${query.toString()}`);

  if (!response.ok) {
    throw new Error('No se pudo obtener el plan semanal');
  }

  return response.json();
};

export const saveMealPlan = async ({ userId = 'pamelagrhz', days }) => {
  const response = await fetch('/api/meal-plans', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ userId, days }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || 'No se pudo guardar el plan semanal');
  }

  return response.json();
};
