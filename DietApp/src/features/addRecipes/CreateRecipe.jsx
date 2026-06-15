import TextField from '@mui/material/TextField';
import { Button } from '@mui/material';
import { useEffect, useState } from 'react';
import {
  createRecipe as createRecipeRequest,
  getIngredients,
  getRecipeTypes,
} from '../showRecipes/services/recipes.service';
import IngredientsSection from './components/IngredientsSection.jsx';
import AddStepsSection from './components/AddStepsSection.jsx';
import NumberSpinner from './components/NumberSpinner.jsx';
import AlertTitle from '@mui/material/AlertTitle';
import Alert from '@mui/material/Alert';
import Grid from '@mui/material/Grid';
import Autocomplete from '@mui/material/Autocomplete';
import './CreateRecipe.css';

export default function CreateRecipe() {
  const [ingredients, setIngredients] = useState([]);
  const [ingredientInput, setIngredientInput] = useState('');
  const [ingredientOptions, setIngredientOptions] = useState([]);
  const [recipeTypeOptions, setRecipeTypeOptions] = useState([]);
  const [recipeType, setRecipeType] = useState('comida');
  const [recipeTypeInput, setRecipeTypeInput] = useState('comida');
  const [cantidadInput, setCantidadInput] = useState('');
  const [porcionesInput, setPorcionesInput] = useState('1');
  const [medidaInput, setMedidaInput] = useState('');
  const [recipeName, setRecipeName] = useState('');
  const [submitAttempted, setSubmitAttempted] = useState(false);
  const [ingredientAttempted, setIngredientAttempted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState('');
  const [submitError, setSubmitError] = useState('');
  const [instructionsText, setInstructionsText] = useState('');

  const medidaOptions = ['g', 'kg', 'ml', 'l', 'pieza(s)', 'taza(s)', 'cda(s)', 'cdita(s)', 'rebanada(s)', 'lata(s)'];

  const fieldErrors = {
    porciones: submitAttempted && `${porcionesInput}`.trim() === '',
    recipeName: submitAttempted && !recipeName.trim(),
    recipeType: submitAttempted && !recipeType.trim(),
    ingredients: submitAttempted && ingredients.length < 1,
    cantidad: ingredientAttempted && cantidadInput === '',
    medida: ingredientAttempted && !medidaInput.trim(),
    steps: submitAttempted && !instructionsText.trim(),
  };

  const handleAddIngredient = () => {
    setIngredientAttempted(true);

    const normalizedIngredient = ingredientInput.trim();
    const normalizedMedida = medidaInput.trim();
    const numericCantidad = Number(cantidadInput);

    if (
      !normalizedIngredient ||
      cantidadInput === '' ||
      !normalizedMedida ||
      Number.isNaN(numericCantidad) ||
      numericCantidad < 0
    ) {
      return;
    }

    setIngredients([
      ...ingredients,
      {
        cantidad: numericCantidad,
        medida: normalizedMedida,
        ingrediente: normalizedIngredient,
      },
    ]);
    setIngredientInput('');
    setCantidadInput('');
    setMedidaInput('');
    setIngredientAttempted(false);
  };

  const handleDeleteIngredient = (idx) => {
    setIngredients(ingredients.filter((_, i) => i !== idx));
  };

  const handleUpdateIngredient = (idx, updatedIngredient) => {
    setIngredients((prevIngredients) =>
      prevIngredients.map((ing, i) => (i === idx ? updatedIngredient : ing))
    );
  };

  const handleCreateRecipe = async () => {
    setSubmitAttempted(true);
    setSubmitMessage('');
    setSubmitError('');

    if (
      `${porcionesInput}`.trim() === '' ||
      !recipeName.trim() ||
      !recipeType.trim() ||
      ingredients.length < 1 ||
      !instructionsText.trim()
    ) {
      return;
    }

    const recipePayload = {
      nombre: recipeName.trim(),
      porciones: Number(porcionesInput),
      ingredientes,
      preparacion: instructionsText.trim(),
      recipeType: recipeType.trim(),
      userId: 'pamelagrhz',
    };

    try {
      setIsSubmitting(true);
      await createRecipeRequest(recipePayload);
      setSubmitMessage('Receta creada correctamente');
      setTimeout(() => setSubmitMessage(''), 3000);
      setRecipeName('');
      setRecipeType(recipeTypeOptions[0] || 'comida');
      setRecipeTypeInput(recipeTypeOptions[0] || 'comida');
      setPorcionesInput('1');
      setIngredients([]);
      setIngredientInput('');
      setCantidadInput('');
      setMedidaInput('');
      setInstructionsText('');
      setSubmitAttempted(false);
      setIngredientAttempted(false);
    } catch (error) {
      setSubmitError(error.message || 'No se pudo guardar la receta');
      setTimeout(() => setSubmitError(''), 3000);
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    let isMounted = true;

    const loadRecipeTypes = async () => {
      try {
        const types = await getRecipeTypes();
        if (isMounted) {
          const uniqueTypes = Array.from(
            new Set(
              Array.isArray(types)
                ? types.map((type) => String(type || '').trim().toLowerCase()).filter(Boolean)
                : []
            )
          );
          setRecipeTypeOptions(uniqueTypes);
          const defaultType = uniqueTypes.includes('comida') ? 'comida' : uniqueTypes[0] || 'comida';
          setRecipeType(defaultType);
          setRecipeTypeInput(defaultType);
        }
      } catch (error) {
        if (isMounted) {
          setRecipeTypeOptions(['comida', 'sopa', 'complemento', 'otro']);
          setRecipeType('comida');
          setRecipeTypeInput('comida');
        }
      }
    };

    loadRecipeTypes();

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    let isMounted = true;

    const loadIngredients = async () => {
      try {
        const result = await getIngredients(ingredientInput);
        if (isMounted) {
          setIngredientOptions(Array.from(new Set(result)));
        }
      } catch (error) {
        if (isMounted) {
          setIngredientOptions([]);
        }
      }
    };

    loadIngredients();

    return () => {
      isMounted = false;
    };
  }, [ingredientInput]);

  return (
    <div className="create-recipe-page">
      <div className="create-recipe-header">
        <div>
          <h1 className="create-recipe-title">Crear Nueva Receta</h1>
          <p className="create-recipe-subtitle">Captura tu receta, agrega ingredientes y pasos para compartirla.</p>
        </div>
        <div className="create-recipe-actions">
          <Button
            size="medium"
            variant="contained"
            className="publish-button"
            onClick={handleCreateRecipe}
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Guardando...' : 'Publicar receta'}
          </Button>
        </div>
      </div>

      <div className="create-recipe-top-card">
        <Grid container spacing={2} alignItems="flex-start">
          <Grid sx={{ width: { xs: '100%', sm: '70%' } }}>
            <TextField
              id="recipe-name"
              label="Nombre de la receta"
              placeholder="Ej: Ensalada fresca con pollo"
              size="small"
              value={recipeName}
              onChange={(e) => setRecipeName(e.target.value)}
              error={fieldErrors.recipeName}
              helperText={fieldErrors.recipeName ? 'Falta el nombre de la receta' : ''}
              fullWidth
            />
            <Autocomplete
              options={recipeTypeOptions}
              value={recipeType}
              inputValue={recipeTypeInput}
              onChange={(_, newValue) => {
                const normalizedValue = String(newValue || '').trim().toLowerCase();
                setRecipeType(normalizedValue);
                setRecipeTypeInput(normalizedValue);
              }}
              onInputChange={(_, newInputValue, reason) => {
                if (reason === 'reset') {
                  return;
                }
                setRecipeTypeInput(String(newInputValue || '').trim().toLowerCase());
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Tipo de receta"
                  placeholder="Selecciona un tipo"
                  size="small"
                  error={fieldErrors.recipeType}
                  helperText={fieldErrors.recipeType ? 'Falta el tipo de receta' : ''}
                />
              )}
              freeSolo={false}
              fullWidth
            />
          </Grid>

          <Grid sx={{ width: { xs: '100%', sm: '30%' } }}>
            <NumberSpinner
              onValueChange={(value) => {
                if (value === null) {
                  setPorcionesInput('');
                  return;
                }

                if (value >= 0) {
                  setPorcionesInput(String(value));
                }
              }}
              value={porcionesInput === '' ? null : Number(porcionesInput)}
              label="Porciones"
              size="small"
              error={fieldErrors.porciones}
              helperText={fieldErrors.porciones ? 'Faltan las porciones' : ''}
              min={1}
              max={40}
            />
          </Grid>
        </Grid>
      </div>

      <div className="create-recipe-content-grid">
        <section className="create-recipe-panel">
          <IngredientsSection
            ingredients={ingredients}
            ingredientOptions={ingredientOptions}
            ingredientInput={ingredientInput}
            setIngredientInput={setIngredientInput}
            cantidadInput={cantidadInput}
            setCantidadInput={setCantidadInput}
            medidaInput={medidaInput}
            setMedidaInput={setMedidaInput}
            medidaOptions={medidaOptions}
            fieldErrors={fieldErrors}
            onAddIngredient={handleAddIngredient}
            onDeleteIngredient={handleDeleteIngredient}
            onUpdateIngredient={handleUpdateIngredient}
          />
        </section>

        <section className="create-recipe-panel">
          <AddStepsSection
            instructionsText={instructionsText}
            setInstructionsText={setInstructionsText}
            fieldErrors={fieldErrors}
          />
        </section>
      </div>

      <div className="create-recipe-feedback" style={{ display: submitMessage || submitError ? 'block' : 'none' }}>
        {submitMessage ? (
          <Alert severity="success">
            <AlertTitle>Success</AlertTitle>
            {submitMessage}
          </Alert>
        ) : null}
        {submitError ? (
          <Alert severity="error">
            <AlertTitle>Error</AlertTitle>
            {submitError}
          </Alert>
        ) : null}
      </div>
    </div>
  );
}