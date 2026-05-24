import { useEffect, useMemo, useState } from 'react';
import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { getRecipes } from '../../showRecipes/services/recipes.service';
import { getMealPlan, saveMealPlan } from '../services/mealPlans.service';
import './MealPlans.css';

const DEFAULT_WEEK = [
  { day: 'Lunes', recipeName: '' },
  { day: 'Martes', recipeName: '' },
  { day: 'Miercoles', recipeName: '' },
  { day: 'Jueves', recipeName: '' },
  { day: 'Viernes', recipeName: '' },
  { day: 'Sabado', recipeName: '' },
  { day: 'Domingo', recipeName: '' },
];

export default function MealPlans() {
  const [recipes, setRecipes] = useState([]);
  const [weekDays, setWeekDays] = useState(DEFAULT_WEEK);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const recipeNames = useMemo(() => recipes.map((recipe) => recipe?.nombre).filter(Boolean), [recipes]);

  useEffect(() => {
    let mounted = true;

    const loadData = async () => {
      try {
        setLoading(true);
        const [recipesResult, mealPlanResult] = await Promise.all([
          getRecipes(),
          getMealPlan(),
        ]);

        if (!mounted) {
          return;
        }

        setRecipes(Array.isArray(recipesResult) ? recipesResult : []);
        setWeekDays(Array.isArray(mealPlanResult?.days) && mealPlanResult.days.length === 7
          ? mealPlanResult.days
          : DEFAULT_WEEK);
      } catch (fetchError) {
        if (mounted) {
          setError(fetchError.message || 'No se pudo cargar meal plans');
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
  }, []);

  const handleRecipeChange = (index, value) => {
    setWeekDays((prev) => prev.map((entry, i) => (i === index ? { ...entry, recipeName: value } : entry)));
  };

  const handleSave = async () => {
    setError('');
    setSuccess('');

    try {
      setSaving(true);
      await saveMealPlan({
        userId: 'pamelagrhz',
        days: weekDays,
      });
      setSuccess('Plan semanal guardado correctamente');
    } catch (saveError) {
      setError(saveError.message || 'No se pudo guardar el plan semanal');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="meal-plans-page">
      <div>
        <Typography component="h1" className="meal-plans-title">Meal Plans</Typography>
        <Typography className="meal-plans-subtitle">Asigna una receta para cada dia de la semana.</Typography>
      </div>

      <div className="meal-plans-toolbar">
        <Typography color="text.secondary">7 espacios disponibles (1 por dia)</Typography>
        <Button variant="contained" onClick={handleSave} disabled={saving || loading}>
          {saving ? 'Guardando...' : 'Guardar semana'}
        </Button>
      </div>

      {error ? (
        <Alert severity="error">
          <AlertTitle>Error</AlertTitle>
          {error}
        </Alert>
      ) : null}

      {success ? (
        <Alert severity="success">
          <AlertTitle>Success</AlertTitle>
          {success}
        </Alert>
      ) : null}

      <Box className="meal-plans-week-grid">
        {weekDays.map((entry, index) => (
          <Card key={entry.day} sx={{ borderRadius: 3, border: '1px solid #d8ddd4' }}>
            <CardContent>
              <Typography variant="overline" color="text.secondary">Dia {index + 1}</Typography>
              <Typography variant="h6" sx={{ fontFamily: 'Bitter, Cambria, Georgia, serif', mb: 1 }}>
                {entry.day}
              </Typography>
              <TextField
                select
                fullWidth
                label="Receta"
                size="small"
                value={entry.recipeName}
                onChange={(event) => handleRecipeChange(index, event.target.value)}
              >
                <MenuItem value="">Sin receta</MenuItem>
                {recipeNames.map((name) => (
                  <MenuItem key={name} value={name}>{name}</MenuItem>
                ))}
              </TextField>
            </CardContent>
          </Card>
        ))}
      </Box>
    </div>
  );
}
