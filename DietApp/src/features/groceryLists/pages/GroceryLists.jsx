import { useEffect, useMemo, useState } from 'react';
import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Checkbox from '@mui/material/Checkbox';
import Divider from '@mui/material/Divider';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import { getAllRecipes } from '../services/groceryLists.service';
import { getMealPlan } from '../../mealPlans/services/mealPlans.service';
import { aggregateIngredients } from '../utils/aggregateIngredients';
import './GroceryLists.css';

export default function GroceryLists() {
  const [recipes, setRecipes] = useState([]);
  const [mealPlanDays, setMealPlanDays] = useState([]);
  const [mealPlanPage, setMealPlanPage] = useState(1);
  const [weekLabel, setWeekLabel] = useState('');
  const [costByItem, setCostByItem] = useState({});
  const [checkedItems, setCheckedItems] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let mounted = true;

    const loadData = async () => {
      try {
        setLoading(true);
        const [recipesData, mealPlanData] = await Promise.all([
          getAllRecipes(),
          getMealPlan({ page: mealPlanPage }),
        ]);

        if (mounted) {
          setRecipes(Array.isArray(recipesData) ? recipesData : []);
          setMealPlanDays(Array.isArray(mealPlanData?.days) ? mealPlanData.days : []);
          setWeekLabel(mealPlanData?.weekStart && mealPlanData?.weekEnd
            ? new Date(mealPlanData.weekStart).toLocaleString('es-ES', { month: 'long' }) === new Date(mealPlanData.weekEnd).toLocaleString('es-ES', { month: 'long' })
              ? `${mealPlanData.weekStart.split('-')[2]} - ${mealPlanData.weekEnd.split('-')[2]} ${new Date(mealPlanData.weekStart).toLocaleString('es-ES', { month: 'long' })} ${new Date(mealPlanData.weekStart).getFullYear()}`
              : `${mealPlanData.weekStart.split('-')[2]} ${new Date(mealPlanData.weekStart).toLocaleString('es-ES', { month: 'long' })} - ${mealPlanData.weekEnd.split('-')[2]} ${new Date(mealPlanData.weekEnd).toLocaleString('es-ES', { month: 'long' })} ${new Date(mealPlanData.weekEnd).getFullYear()}`
            : 'Semana');
        }
      } catch (fetchError) {
        if (mounted) {
          setError(fetchError.message || 'No se pudieron cargar las recetas o el meal plan');
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    loadData();

    return () => {
      mounted = false;
    };
  }, [mealPlanPage]);

  const recipesByName = useMemo(() => {
    const map = new Map();
    recipes.forEach((recipe) => {
      if (recipe?.nombre) {
        map.set(recipe.nombre, recipe);
      }
    });
    return map;
  }, [recipes]);

  const mealPlanAssignments = useMemo(
    () => mealPlanDays
      .map((day) => ({
        date: day?.date,
        dayLabel: day?.dayLabel,
        recipeName: day?.recipeName || '',
        recipe: recipesByName.get(day?.recipeName),
      })),
    [mealPlanDays, recipesByName]
  );

  const selectedRecipes = useMemo(
    () => mealPlanAssignments.map((entry) => entry.recipe).filter(Boolean),
    [mealPlanAssignments]
  );

  const groceryItems = useMemo(
    () => aggregateIngredients(selectedRecipes),
    [selectedRecipes]
  );

  const totalSpent = useMemo(
    () => groceryItems.reduce((sum, item) => sum + (Number(costByItem[`${item.ingrediente}__${item.medida}`]) || 0), 0),
    [groceryItems, costByItem]
  );

  const handleToggleIngredient = (key) => {
    setCheckedItems((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const navigate = (path) => {
    window.location.href = path;
  }
  const handleSelectAllIngredients = () => {
    const next = {};
    groceryItems.forEach((item) => {
      next[`${item.ingrediente}__${item.medida}`] = true;
    });
    setCheckedItems(next);
  };

  const handleClear = () => {
    setCostByItem({});
    setCheckedItems({});
  };

  const handlePreviousWeek = () => {
    setMealPlanPage((prev) => Math.max(1, prev - 1));
  };

  const handleNextWeek = () => {
    setMealPlanPage((prev) => prev + 1);
  };

  return (
    <div className="grocery-lists-page">
      <div>
        <Typography component="h1" className="grocery-lists-title">Grocery List</Typography>
        <Typography className="grocery-lists-subtitle">Toma las recetas del meal plan y consolida sus ingredientes automáticamente.</Typography>
      </div>

      <div className="grocery-lists-toolbar">
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
          {/* Semana anterior */}
          <Button
            variant="outlined"
            className="meal-plans-outline-button"
            startIcon={<NavigateBeforeIcon />}
            disabled={loading || mealPlanPage <= 1}
            onClick={handlePreviousWeek}
          >
          </Button>
          <Typography className="grocery-lists-subtitle">{weekLabel}</Typography>
          {/* Semana siguiente */}
          <Button
            variant="outlined"
            className="meal-plans-outline-button"
            endIcon={<NavigateNextIcon />}
            disabled={loading}
            onClick={handleNextWeek}
          >
          </Button>
        </Box>
        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
          <Button variant="outlined" className="meal-plans-outline-button" onClick={handleSelectAllIngredients} disabled={loading}>Marcar todos los ingredientes</Button>
          <Button variant="outlined" onClick={handleClear} disabled={loading}>Limpiar</Button>
        </Box>
      </div>

      {error ? (
        <Alert severity="error">
          <AlertTitle>Error</AlertTitle>
          {error}
        </Alert>
      ) : null}

      <div className="grocery-lists-grid">
        <section className="grocery-lists-panel">
          <Typography variant="h6" sx={{ fontFamily: 'Bitter, Cambria, Georgia, serif', mb: 1 }}>Recetas del meal plan</Typography>
          <Typography sx={{ color: '#4f5b54', mb: 2 , cursor: 'pointer'}}>
            Estas recetas salen automáticamente del 
                      <a onClick={() => navigate('/meal-plans')} disabled={loading}> plan semanal seleccionado.</a>

          </Typography>

          <Box sx={{ display: 'grid', gap: 1 }}>
            {mealPlanAssignments.length > 0 ? mealPlanAssignments.map((entry, idx) => (
              <Typography
                key={entry.date || `${entry.dayLabel || 'dia'}-${entry.recipeName || 'sin-asignar'}-${idx}`}
                sx={{
                  fontSize: '1rem',
                  fontWeight: 600,
                  color: '#1c5a40',
                  px: 1,
                  py: 0.75,
                  borderRadius: 2,
                  backgroundColor: '#ecefea',
                  border: '1px solid #d8ddd4',
                }}
              >
                {entry.dayLabel ? `${entry.dayLabel}: ` : ''}{entry.recipeName || 'Sin asignar'}
              </Typography>
            )) : (
              <Alert severity="info">No hay recetas asignadas en el meal plan de esta semana.</Alert>
            )}
          </Box>
        </section>

        <section className="grocery-lists-panel">

          <table className="grocery-lists-ingredient-table">
            <thead>
              <tr>
                <th>OK</th>
                <th>Ingrediente</th>
                <th>Cantidad total</th>
                <th>Medida</th>
                <th>Precio gastado</th>
              </tr>
            </thead>
            <tbody>
              {groceryItems.length > 0 ? groceryItems.map((item) => {
                const key = `${item.ingrediente}__${item.medida}`;
                const spentValue = costByItem[key] || '';
                const checked = Boolean(checkedItems[key]);
                return (
                  <tr key={key}>
                    <td>
                      <Checkbox
                        size="small"
                        checked={checked}
                        onChange={() => handleToggleIngredient(key)}
                      />
                    </td>
                    <td>{item.ingrediente}</td>
                    <td style={{ textDecoration: checked ? 'line-through' : 'none', opacity: checked ? 0.6 : 1 }}>{item.cantidad}</td>
                    <td style={{ textDecoration: checked ? 'line-through' : 'none', opacity: checked ? 0.6 : 1 }}>{item.medida}</td>
                    <td>
                      <TextField
                        className="grocery-lists-money-input"
                        size="small"
                        type="number"
                        value={spentValue}
                        onChange={(event) => {
                          const nextValue = event.target.value;
                          setCostByItem((prev) => ({
                            ...prev,
                            [key]: nextValue,
                          }));
                        }}
                        slotProps={{
                          htmlInput: {
                            min: 0,
                            step: '0.01',
                          },
                        }}
                        placeholder="Opcional"
                      />
                    </td>
                  </tr>
                );
              }) : (
                <tr>
                  <td colSpan={5}>
                    <Typography sx={{ py: 2, color: 'text.secondary', fontStyle: 'italic' }}>
                      No hay ingredientes para mostrar todavía.
                    </Typography>
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          <Divider sx={{ my: 2 }} />

          <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 2, flexWrap: 'wrap' }}>
            <Typography className="grocery-lists-total">Total gastado</Typography>
            <Typography className="grocery-lists-total">${totalSpent.toFixed(2)}</Typography>
          </Box>
        </section>
      </div>
    </div>
  );
}
