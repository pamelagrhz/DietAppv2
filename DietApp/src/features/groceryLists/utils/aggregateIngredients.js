export const aggregateIngredients = (recipes) => {
  const grouped = new Map();

  recipes.forEach((recipe) => {
    (recipe?.ingredientes || []).forEach((ingredient) => {
      const ingredientName = String(ingredient?.ingrediente || '').trim();
      const medida = String(ingredient?.medida || '').trim();
      const cantidad = Number(ingredient?.cantidad);

      if (!ingredientName || !medida || Number.isNaN(cantidad)) {
        return;
      }

      const key = `${ingredientName.toLowerCase()}__${medida.toLowerCase()}`;
      const current = grouped.get(key) || {
        ingrediente: ingredientName,
        medida,
        cantidad: 0,
      };

      current.cantidad = Number((current.cantidad + cantidad).toFixed(4));
      grouped.set(key, current);
    });
  });

  return Array.from(grouped.values()).sort((a, b) => a.ingrediente.localeCompare(b.ingrediente));
};
