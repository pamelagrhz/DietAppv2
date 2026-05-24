import TextField from '@mui/material/TextField';
import { Button } from '@mui/material';
import { useEffect, useState } from 'react';
import { createRecipe as createRecipeRequest, getIngredients } from '../showRecipes/services/recipes.service';
import IngredientsSection from './components/IngredientsSection.jsx';
import AddStepsSection from './components/AddStepsSection.jsx';
import NumberSpinner from './components/NumberSpinner.jsx';
import AlertTitle from '@mui/material/AlertTitle';
import Alert from '@mui/material/Alert';
import Grid from '@mui/material/Grid';
import './CreateRecipe.css';


export default function CreateRecipe() {
    // ingredients states
    const [ingredients, setIngredients] = useState([]); // array de ingredientes
    const [ingredientInput, setIngredientInput] = useState(""); // input controlado
    const [ingredientOptions, setIngredientOptions] = useState([]);
    const [cantidadInput, setCantidadInput] = useState("");
    const [porcionesInput, setPorcionesInput] = useState("1");
    const [medidaInput, setMedidaInput] = useState("");
    // recipe, submit and ingredient state
    const [recipeName, setRecipeName] = useState("");
    const [submitAttempted, setSubmitAttempted] = useState(false);
    const [ingredientAttempted, setIngredientAttempted] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitMessage, setSubmitMessage] = useState("");
    const [submitError, setSubmitError] = useState("");
    const medidaOptions = ["g", "kg", "ml", "l", "pieza(s)", "taza(s)", "cda(s)", "cdita(s)", "rebanada(s)", "lata(s)"];

    // instructions state
    const [instructionsText, setInstructionsText] = useState("");
    // field errors for validation
    const fieldErrors = {
        porciones: submitAttempted && `${porcionesInput}`.trim() === "",
        recipeName: submitAttempted && !recipeName.trim(),
        ingredients: submitAttempted && ingredients.length < 1,
        cantidad: ingredientAttempted && cantidadInput === "",
        medida: ingredientAttempted && !medidaInput.trim(),
        steps: submitAttempted && !instructionsText.trim(),
    };

    //Add handlers for the chip component, to handle the click and delete events
    const handleAddIngredient = () => {
        // Validate inputs
        setIngredientAttempted(true);
        const normalizedIngredient = ingredientInput.trim();
        const normalizedMedida = medidaInput.trim();
        const numericCantidad = Number(cantidadInput);
        // If any validation fails, do not add the ingredient and show errors
        if (
            !normalizedIngredient ||
            cantidadInput === "" ||
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
                ingrediente: normalizedIngredient
            }
        ]);
        setIngredientInput("");
        setCantidadInput("");
        setMedidaInput("");
        // Reset attempted state after successful addition
        setIngredientAttempted(false);
    };

    //Delete handler for the chip component, to remove the ingredient from the list
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
        setSubmitMessage("");
        setSubmitError("");

        if (
            `${porcionesInput}`.trim() === "" ||
            !recipeName.trim() ||
            ingredients.length < 1 ||
            !instructionsText.trim()
        ) {
            return;
        }

        const recipePayload = {
            nombre: recipeName.trim(),
            porciones: Number(porcionesInput),
            ingredientes: ingredients,
            preparacion: instructionsText.trim(),
            userId: "pamelagrhz", // TODO: Replace with actual user ID
            };

        try {
            setIsSubmitting(true);
            await createRecipeRequest(recipePayload);
            setSubmitMessage('Receta creada correctamente');
            setTimeout(() => {
                setSubmitMessage("");
            }, 3000);
            setRecipeName("");
            setPorcionesInput("1");
            setIngredients([]);
            setIngredientInput("");
            setCantidadInput("");
            setMedidaInput("");
            setInstructionsText("");
            setSubmitAttempted(false);
            setIngredientAttempted(false);
        } catch (error) {
            setSubmitError(error.message || 'No se pudo guardar la receta');
            setTimeout(() => {
                setSubmitError("");
            }, 3000);
        } finally {
            setIsSubmitting(false);
        }
    };

    useEffect(() => {
        let isMounted = true;

        const loadIngredients = async () => {
            try {
                const result = await getIngredients(ingredientInput);
                if (isMounted) {
                    const unique = Array.from(new Set(result));
                    setIngredientOptions(unique);
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
                    {/* TODO: Implement draft saving functionality */}
                    {/* <Button size="medium" variant="outlined" className="draft-button" disabled>
                        Guardar borrador
                    </Button> */}
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