import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import { Button } from '@mui/material';
import Chip from '@mui/material/Chip';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Divider from '@mui/material/Divider';
import { useEffect, useState } from 'react';
import { getIngredients } from '../services/recipes.service';


export default function CreateRecipe() {
    // Estilos
    const createRecipe = {
        display: "flex",
        flexDirection: "column",
        gap: "1rem",
    }
    const stepsStyle = {
        py: 0,
        width: '100%',
        borderRadius: 2,
        border: '1px solid',
        borderColor: 'divider',
        backgroundColor: 'background.paper',
        fontSize: '0.92rem',
        maxHeight: 150, // 
        overflowY: 'auto',
    };
    const addIngredient = {
        display: "flex",
        flexDirection: "row",
    }


    // ingredients states
    const [ingredients, setIngredients] = useState([]); // array de ingredientes
    const [ingredientInput, setIngredientInput] = useState(""); // input controlado
    const [ingredientOptions, setIngredientOptions] = useState([]);
    const [cantidadInput, setCantidadInput] = useState("");
    const [porcionesInput, setPorcionesInput] = useState(1);
    const [medidaInput, setMedidaInput] = useState("");
    const medidaOptions = ["g", "kg", "ml", "l", "pieza(s)", "taza(s)", "cda(s)", "cdita(s)", "rebanada(s)", "lata(s)"];

    // steps (instructions) states
    const [steps, setSteps] = useState([]); // array de pasos
    const [stepInput, setStepInput] = useState("");

    const handleAddStep = () => {
        if (stepInput.trim()) {
            setSteps([...steps, stepInput.trim()]);
            setStepInput("");
        }
    };

    const handleDeleteStep = (idx) => {
        setSteps(steps.filter((_, i) => i !== idx));
    };

    //Add handlers for the chip component, to handle the click and delete events
    const handleAddIngredient = () => {
        const normalizedIngredient = ingredientInput.trim();
        const normalizedMedida = medidaInput.trim();
        const numericCantidad = Number(cantidadInput);

        if (
            normalizedIngredient &&
            cantidadInput !== "" &&
            normalizedMedida &&
            !Number.isNaN(numericCantidad) &&
            numericCantidad >= 0
        ) {
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
        }
    };

    //Delete handler for the chip component, to remove the ingredient from the list
    const handleDeleteIngredient = (idx) => {
        setIngredients(ingredients.filter((_, i) => i !== idx));
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
        < div style={createRecipe}>
            <div style={{ display: 'flex', flexDirection: 'row', gap: '8px' }}>
                <TextField
                    value={porcionesInput}
                    onChange={e => {
                        const val = Number(e.target.value);
                        setPorcionesInput(val < 0 ? 0 : val);
                    }}
                    style={{ width: 80 }}
                    label="Porciones"
                    size="small"
                    type="number"
                    min={0}
                />
                <TextField id="recipe-name" style={{ width: '100%' }} label="Nombre de la receta"  size='small'/>
            </div>
            Ingredientes:
            {/* Added ingredients */}
            <div style={{ display: ingredients.length > 0 ? "flex" : "none", flexWrap: "wrap", gap: "8px", marginBottom: "8px" }}>
                {ingredients.map((ing, idx) => (
                    <Chip
                        key={idx}
                        label={`${ing.cantidad} ${ing.medida} ${ing.ingrediente}`}
                        onDelete={() => handleDeleteIngredient(idx)}
                        style={{ margin: 4 }}
                    />
                ))}
            </div>
            {/* Inputs to add ingredients*/}
            {/* TODO: add conditions and errors*/}

            <div style={addIngredient}>
                <Autocomplete
                    freeSolo
                    options={ingredientOptions}
                    inputValue={ingredientInput}
                    onChange={(_, newValue) => setIngredientInput(typeof newValue === 'string' ? newValue : "")}
                    onInputChange={(_, newInputValue, reason) => {
                        if (reason === 'reset') return;
                        setIngredientInput(newInputValue || "");
                    }}
                    clearOnBlur={false}
                    sx={{ width: '50%' }}
                    renderInput={(params) => (
                        <TextField
                            {...params}
                            label="Ingrediente"
                            size="small"
                        />
                    )}
                />
                <TextField
                    label="Cantidad"
                    value={cantidadInput}
                    onChange={e => {
                        const val = e.target.value;
                        if (val === "") {
                            setCantidadInput("");
                            return;
                        }

                        const numericValue = Number(val);
                        if (!Number.isNaN(numericValue) && numericValue >= 0) {
                            setCantidadInput(val);
                        }
                    }}
                    type="number"
                    size="small"
                    style={{width: 80}}
                    min={0}
                />
                <Autocomplete
                    disablePortal
                    options={medidaOptions}
                    value={medidaInput}
                     style={{width: 100}}
                    onChange={(_, newValue) => setMedidaInput(newValue || "")}
                    sx={{ width: 120 }}
                    renderInput={(params) => <TextField {...params} label="Medida" size="small" />}
                />
              </div>
                <Button size='small' sx={{ width: 100}} variant="outlined" onClick={handleAddIngredient}>Agregar</Button>
                
            Instrucciones:
            <List style={{display: steps.length > 0 ? "block" : "none"}} sx={stepsStyle} subheader={
                // TODO: Fix styles
                <li style={{ position: 'sticky', top: 0, background: '#fff', zIndex: 1
                }}>
                </li>
            }>
                {steps.map((step, idx) => (
                    <ListItem 
                        key={idx} 
                        secondaryAction={
                            <Button 
                                color="error"
                                size="small"
                                onClick={() => handleDeleteStep(idx)}
                                sx={{ minWidth: 0, width: 24, height: 24, p: 0, borderRadius: '50%', fontSize: '1rem' }}
                            >
                                ×
                            </Button>
                        }
                        sx={{ py: 0.2, minHeight: 32 }}
                    >
                        <ListItemText 
                        sx={{ width: '100%'}}
                            primary={`${idx + 1}.- ${step}`}
                            primaryTypographyProps={{ fontSize: '0.92rem' }}
                        />
                    </ListItem>
                ))}
            </List>
            <div style={createRecipe}>
                <TextField
                    id="recipe-instructions"
                    label="Paso: "
                    variant="outlined"
                    size='small'
                    value={stepInput}
                    onChange={e => setStepInput(e.target.value)}
                />
                <Button size='small' sx={{ width: 100 }} variant="outlined" onClick={handleAddStep}>Agregar</Button>
            </div>
            {/* TODO: add function to add recipe to the database, with all the states as parameters */}
             <Button size='medium'  variant="contained" onClick={handleAddStep}>Crear Receta</Button>

            {/* TODO: implement picture */}
            {/* <h4>Imágen:</h4> */}
        </div>
    )
}