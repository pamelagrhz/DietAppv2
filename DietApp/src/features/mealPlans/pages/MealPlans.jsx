import { useEffect, useMemo, useState } from 'react';
import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';
import Autocomplete from '@mui/material/Autocomplete';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Checkbox from '@mui/material/Checkbox';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Tooltip from '@mui/material/Tooltip';

import { getRecipes } from '../../showRecipes/services/recipes.service';
import RecipeReviewCard from '../../showRecipes/components/RecipeCard.jsx';
import {
  getMealPlan,
  saveMealPlan,
  searchMealPlanRecipes,
} from '../services/mealPlans.service';
import './MealPlans.css';

// Icons
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import PlaylistAddCheckCircleIcon from '@mui/icons-material/PlaylistAddCheckCircle';


export default function MealPlans() {
  const [recipes, setRecipes] = useState([]);
  const [weekDays, setWeekDays] = useState([]);
  const [weekPage, setWeekPage] = useState(1);
  const [weekStart, setWeekStart] = useState('');
  const [weekEnd, setWeekEnd] = useState('');
  const [weekLabel, setWeekLabel] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [searching, setSearching] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeDate, setActiveDate] = useState('');
  const [searchResultsByDate, setSearchResultsByDate] = useState({});
  const [searchInputByDate, setSearchInputByDate] = useState({});
  const [bulkEditMode, setBulkEditMode] = useState(false);
  const [selectedDays, setSelectedDays] = useState({});
  const [bulkRecipeName, setBulkRecipeName] = useState('');
  const [bulkInputValue, setBulkInputValue] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const recipeNames = useMemo(
    () => recipes.map((recipe) => recipe?.nombre).filter(Boolean),
    [recipes]
  );
  const recipesByName = useMemo(() => {
    const map = new Map();
    recipes.forEach((recipe) => {
      if (recipe?.nombre) {
        map.set(recipe.nombre, recipe);
      }
    });
    return map;
  }, [recipes]);

   useEffect(() => {
    setWeekLabel(weekStart && weekEnd
      ? new Date(weekStart).toLocaleString('es-ES', { month: 'long' }) === new Date(weekEnd).toLocaleString('es-ES', { month: 'long' })
        ? `${weekStart.split('-')[2]} - ${weekEnd.split('-')[2]} ${new Date(weekStart).toLocaleString('es-ES', { month: 'long' })} ${new Date(weekStart).getFullYear()}`
        : `${weekStart.split('-')[2]} ${new Date(weekStart).toLocaleString('es-ES', { month: 'long' })} - ${weekEnd.split('-')[2]} ${new Date(weekEnd).toLocaleString('es-ES', { month: 'long' })} ${new Date(weekEnd).getFullYear()}`
      : 'Semana');
  }, [weekStart, weekEnd]);

  useEffect(() => {
    let mounted = true;

    const loadRecipes = async () => {
      try {
        const recipesResult = await getRecipes();
        if (mounted) {
          setRecipes(Array.isArray(recipesResult) ? recipesResult : []);
        }
      } catch (fetchError) {
        if (mounted) {
          setError(fetchError.message || 'No se pudieron cargar las recetas');
        }
      }
    };

    loadRecipes();

    return () => {
      mounted = false;
    };
  }, []);

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
        setSelectedDays({});
        setBulkRecipeName('');
        setBulkInputValue('');
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

  const navigate = (path) => {
    window.location.href = path;
  }
  const handleBulkApply = () => {
    const selectedDates = Object.keys(selectedDays).filter((date) => selectedDays[date]);

    if (selectedDates.length === 0) {
      setError('Selecciona al menos un dia para editar varias recetas.');
      return;
    }

    setWeekDays((prev) =>
      prev.map((day) =>
        selectedDates.includes(day.date)
          ? { ...day, recipeName: bulkRecipeName || '' }
          : day
      )
    );
    setSuccess('Receta aplicada a los dias seleccionados.');
    setSelectedDays({});
  };

  const getOptionsForDay = (entry) => {
    const inputValue = (searchInputByDate[entry.date] ?? '').trim().toLowerCase();

    if (!inputValue) {
      return recipeNames;
    }

    if (inputValue.length < 3) {
      return recipeNames.filter((name) => name.toLowerCase().includes(inputValue));
    }

    return searchResultsByDate[entry.date] || recipeNames.filter((name) => name.toLowerCase().includes(inputValue));
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
        <Typography className="meal-plans-subtitle">Selecciona recetas por dia y usa edicion multiple para varios dias.</Typography>
      </div>

      <div className="meal-plans-toolbar">
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          {/* Semana anterior */}
          <Button
            variant="outlined"
            className="meal-plans-outline-button"
            startIcon={<NavigateBeforeIcon />}
            disabled={weekPage <= 1 || loading}
            onClick={() => setWeekPage((prev) => Math.max(1, prev - 1))}
          >
          </Button>
          <Typography sx={{ minWidth: 220, textAlign: 'center', fontWeight: 600 }} className="meal-plans-compact-label">
            {weekLabel}
          </Typography>
          {/* Semana siguiente */}
          <Button
            variant="outlined"
            className="meal-plans-outline-button"
            endIcon={<NavigateNextIcon />}
            disabled={loading}
            onClick={() => setWeekPage((prev) => prev + 1)}
          >
          </Button>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
         <Tooltip title="Lista de compras"><Button variant="outlined" className="meal-plans-outline-button" onClick={() => navigate('/grocery-lists')} disabled={loading}><PlaylistAddCheckCircleIcon /></Button></Tooltip>
          <Button
            variant={bulkEditMode ? 'contained' : 'outlined'}
            className={bulkEditMode ? 'meal-plans-primary-button' : 'meal-plans-outline-button'}
            onClick={() => {
              setBulkEditMode((prev) => !prev);
              setSelectedDays({});
            }}
          >
            {bulkEditMode ? 'Cancelar edicion multiple' : 'Editar varias recetas'}
          </Button>
          <Button variant="contained" onClick={handleSave} disabled={saving || loading}>
            {saving ? 'Guardando...' : 'Guardar semana'}
          </Button>
        </Box>
      </div>

      {bulkEditMode ? (
        <Card sx={{ borderRadius: 3, border: '1px solid #d8ddd4' }}>
          <CardContent sx={{ display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap' }}>
            <Typography sx={{ fontWeight: 600 }}>Edicion multiple:</Typography>
            <Autocomplete
              sx={{ minWidth: 300, flex: 1 }}
              options={recipeNames}
              value={bulkRecipeName}
              inputValue={bulkInputValue}
              onChange={(_, newValue) => setBulkRecipeName(newValue || '')}
              onInputChange={(_, newInputValue) => setBulkInputValue(newInputValue || '')}
              renderInput={(params) => (
                <TextField
                  {...params}
                  size="small"
                  label="Receta para dias seleccionados"
                  helperText="Tambien puedes dejarlo vacio para limpiar varios dias"
                />
              )}
            />
              <Button variant="outlined" className="meal-plans-outline-button" onClick={handleBulkApply}>Aplicar a seleccionados</Button>
          </CardContent>
        </Card>
      ) : null}

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
          <Card key={entry.date || entry.dayLabel} className="meal-plans-surface">
            <CardContent>
              <Typography variant="overline" color="text.secondary">Dia {index + 1}</Typography>
              <Typography variant="h6" sx={{ fontFamily: 'Bitter, Cambria, Georgia, serif', mb: 0.5 }}>
                {entry.dayLabel}
              </Typography>
              <Typography sx={{ fontSize: '0.8rem', color: 'text.secondary', mb: 1 }}>{entry.date}</Typography>

              {bulkEditMode ? (
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <Checkbox
                    size="small"
                    checked={Boolean(selectedDays[entry.date])}
                    onChange={(event) => {
                      const checked = event.target.checked;
                      setSelectedDays((prev) => ({
                        ...prev,
                        [entry.date]: checked,
                      }));
                    }}
                  />
                  <Typography sx={{ fontSize: '0.85rem' }}>Seleccionar para edicion multiple</Typography>
                </Box>
              ) : null}

              <Autocomplete
                fullWidth
                options={getOptionsForDay(entry)}
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
                      [entry.date]: recipeNames,
                    }));
                    return;
                  }

                  setActiveDate(entry.date);
                  setSearchTerm(newInputValue);
                }}
                noOptionsText="No hay recetas con ese nombre"
                loading={searching && activeDate === entry.date}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    size="small"
                    label="Buscar receta"
                    helperText="Muestra todas; desde 3 letras consulta backend"
                  />
                )}
              />

              {entry.recipeName && recipesByName.get(entry.recipeName) ? (
                <div className="meal-plans-recipe-preview">
                  <RecipeReviewCard recipe={recipesByName.get(entry.recipeName)} />
                </div>
              ) : (
                <div className="meal-plans-empty-card">
                  <Typography sx={{ color: '#6f7872', fontStyle: 'italic' }}>Empty Atelier</Typography>
                  <Typography sx={{ color: '#7e8781', fontSize: '0.85rem' }}>Selecciona una receta para este dia</Typography>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </Box>
    </div>
  );
}
