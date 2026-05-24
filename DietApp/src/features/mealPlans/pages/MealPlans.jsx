import { useEffect, useMemo, useState } from 'react';
import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';
import Autocomplete from '@mui/material/Autocomplete';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import {
  getMealPlan,
  saveMealPlan,
  searchMealPlanRecipes,
} from '../services/mealPlans.service';
import './MealPlans.css';

export default function MealPlans() {
  const [weekDays, setWeekDays] = useState([]);
  const [weekPage, setWeekPage] = useState(1);
  const [weekStart, setWeekStart] = useState('');
  const [weekEnd, setWeekEnd] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [searching, setSearching] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeDate, setActiveDate] = useState('');
  const [searchResultsByDate, setSearchResultsByDate] = useState({});
  const [searchInputByDate, setSearchInputByDate] = useState({});
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const weekLabel = useMemo(() => {
    if (!weekStart || !weekEnd) {
      return 'Semana';
    }

    return `${weekStart} - ${weekEnd}`;
  }, [weekStart, weekEnd]);

  useEffect(() => {
    let mounted = true;

    const loadData = async () => {
      try {
        setLoading(true);
        const mealPlanResult = await getMealPlan({ page: weekPage });

        if (!mounted) {
          return;
        }

        setWeekDays(Array.isArray(mealPlanResult?.days) ? mealPlanResult.days : []);
        setWeekStart(mealPlanResult?.weekStart || '');
        setWeekEnd(mealPlanResult?.weekEnd || '');
        setSearchInputByDate({});
        setSearchResultsByDate({});
        setSuccess('');
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
  }, [weekPage]);

  useEffect(() => {
    if (!activeDate || searchTerm.trim().length < 3) {
      return;
    }

    let mounted = true;
    setSearching(true);

    const timeoutId = setTimeout(async () => {
      try {
        const results = await searchMealPlanRecipes(searchTerm);
        if (mounted) {
          setSearchResultsByDate((prev) => ({
            ...prev,
            [activeDate]: results,
          }));
        }
      } catch (searchError) {
        if (mounted) {
          setError(searchError.message || 'No se pudo realizar la busqueda');
        }
      } finally {
        if (mounted) {
          setSearching(false);
        }
      }
    }, 280);

    return () => {
      mounted = false;
      clearTimeout(timeoutId);
    };
  }, [searchTerm, activeDate]);

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
        page: weekPage,
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
        <Typography className="meal-plans-subtitle">Busqueda desde el 3er caracter y vista semanal paginada.</Typography>
      </div>

      <div className="meal-plans-toolbar">
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Button
            variant="outlined"
            startIcon={<NavigateBeforeIcon />}
            disabled={weekPage <= 1 || loading}
            onClick={() => setWeekPage((prev) => Math.max(1, prev - 1))}
          >
            Semana anterior
          </Button>
          <Typography sx={{ minWidth: 220, textAlign: 'center', fontWeight: 600 }}>{weekLabel}</Typography>
          <Button
            variant="outlined"
            endIcon={<NavigateNextIcon />}
            disabled={loading}
            onClick={() => setWeekPage((prev) => prev + 1)}
          >
            Semana siguiente
          </Button>
        </Box>
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
          <Card key={entry.date || entry.dayLabel} sx={{ borderRadius: 3, border: '1px solid #d8ddd4' }}>
            <CardContent>
              <Typography variant="overline" color="text.secondary">Dia {index + 1}</Typography>
              <Typography variant="h6" sx={{ fontFamily: 'Bitter, Cambria, Georgia, serif', mb: 1 }}>
                {entry.dayLabel}
              </Typography>
              <Typography sx={{ fontSize: '0.8rem', color: 'text.secondary', mb: 1 }}>{entry.date}</Typography>
              <Autocomplete
                fullWidth
                options={searchResultsByDate[entry.date] || []}
                value={entry.recipeName || ''}
                inputValue={searchInputByDate[entry.date] ?? entry.recipeName ?? ''}
                onChange={(_, newValue) => {
                  const selectedName = newValue || '';
                  handleRecipeChange(index, selectedName);
                  setSearchInputByDate((prev) => ({
                    ...prev,
                    [entry.date]: selectedName,
                  }));
                }}
                onInputChange={(_, newInputValue, reason) => {
                  if (reason === 'reset') {
                    return;
                  }

                  setSearchInputByDate((prev) => ({
                    ...prev,
                    [entry.date]: newInputValue,
                  }));

                  if ((newInputValue || '').trim().length < 3) {
                    setSearchResultsByDate((prev) => ({
                      ...prev,
                      [entry.date]: [],
                    }));
                    return;
                  }

                  setActiveDate(entry.date);
                  setSearchTerm(newInputValue);
                }}
                noOptionsText="Escribe 3 caracteres para buscar"
                loading={searching && activeDate === entry.date}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    size="small"
                    label="Buscar receta"
                    helperText="Busca por nombre desde 3 letras"
                  />
                )}
              />
            </CardContent>
          </Card>
        ))}
      </Box>
    </div>
  );
}
