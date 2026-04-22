import TextField from '@mui/material/TextField';
import { Button } from '@mui/material';
import { useEffect, useState } from 'react';
import { createRecipe as createRecipeRequest, getIngredients } from '../showRecipes/services/recipes.service';
import IngredientsSection from './components/IngredientsSection.jsx';
import StepsSection from './components/StepsSection.jsx';


export default function CreateRecipe() {
    // Estilos
    const createRecipeStyle = {
        display: "flex",
        flexDirection: "column",
        gap: "1rem",
    }

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

    // steps (instructions) states
    const [steps, setSteps] = useState([]); // array de pasos
    const [stepInput, setStepInput] = useState("");
    // field errors for validation
    const fieldErrors = {
        porciones: submitAttempted && `${porcionesInput}`.trim() === "",
        recipeName: submitAttempted && !recipeName.trim(),
        ingredients: submitAttempted && ingredients.length < 1,
        cantidad: ingredientAttempted && cantidadInput === "",
        medida: ingredientAttempted && !medidaInput.trim(),
        steps: submitAttempted && steps.length < 1,
    };

    const handleAddStep = () => {
        if (!stepInput.trim()) {
            return;
        }
        // Add the new step to the steps array and clear the input
        setSteps([...steps, stepInput.trim()]);
        setStepInput("");
    };

    const handleDeleteStep = (idx) => {
        setSteps(steps.filter((_, i) => i !== idx));
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

    const handleCreateRecipe = async () => {
        setSubmitAttempted(true);
        setSubmitMessage("");
        setSubmitError("");

        if (
            `${porcionesInput}`.trim() === "" ||
            !recipeName.trim() ||
            ingredients.length < 1 ||
            steps.length < 1
        ) {
            return;
        }

        const recipePayload = {
            nombre: recipeName.trim(),
            porciones: Number(porcionesInput),
            ingredientes: ingredients,
            preparacion: steps,
        };

        try {
            setIsSubmitting(true);
            await createRecipeRequest(recipePayload);
            setSubmitMessage('Receta creada correctamente');
            setRecipeName("");
            setPorcionesInput("1");
            setIngredients([]);
            setIngredientInput("");
            setCantidadInput("");
            setMedidaInput("");
            setSteps([]);
            setStepInput("");
            setSubmitAttempted(false);
            setIngredientAttempted(false);
        } catch (error) {
            setSubmitError(error.message || 'No se pudo guardar la receta');
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
        <div style={createRecipeStyle}>
            <div style={{ display: 'flex', flexDirection: 'row', gap: '8px' }}>
                <TextField
                    value={porcionesInput}
                    onChange={e => {
                        const val = e.target.value;
                        // Allow empty input to let users clear the field
                        if (val === "") {
                            setPorcionesInput("");
                            return;
                        }
                        // Validate that the input is a non-negative number
                        const numericValue = Number(val);
                        if (!Number.isNaN(numericValue) && numericValue >= 0) {
                            setPorcionesInput(val);
                        }
                    }}
                    style={{ width: 80 }}
                    label="Porciones"
                    size="small"
                    type="number"
                    error={fieldErrors.porciones}
                    helperText={fieldErrors.porciones ? "Faltan las porciones" : ""}
                    inputProps={{ min: 1 }}
                />
                <TextField
                    id="recipe-name"
                    style={{ width: '100%' }}
                    label="Nombre de la receta"
                    size='small'
                    value={recipeName}
                    onChange={e => setRecipeName(e.target.value)}
                    error={fieldErrors.recipeName}
                    helperText={fieldErrors.recipeName ? "Falta el nombre de la receta" : ""}
                />
            </div>
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
            />

            <StepsSection
                steps={steps}
                stepInput={stepInput}
                setStepInput={setStepInput}
                fieldErrors={fieldErrors}
                onAddStep={handleAddStep}
                onDeleteStep={handleDeleteStep}
            />
            {submitMessage && <p style={{ color: 'green', margin: 0 }}>{submitMessage}</p>}
            {submitError && <p style={{ color: 'crimson', margin: 0 }}>{submitError}</p>}

            <Button
                size='medium'
                variant="contained"
                onClick={handleCreateRecipe}
                disabled={isSubmitting}
            >
                {isSubmitting ? 'Guardando...' : 'Crear Receta'}
            </Button>

            {/* TODO: implement picture */}
            {/* <h4>Imágen:</h4> */}
        </div>
    )
}