import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import { Button } from '@mui/material';
import Chip from '@mui/material/Chip';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Divider from '@mui/material/Divider';
import { useState } from 'react';


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
        maxWidth: 360,
        borderRadius: 2,
        border: '1px solid',
        borderColor: 'divider',
        backgroundColor: 'background.paper',
    }; 
    const addIngredient = {
        display: "flex",
        flexDirection: "column",
    }


    // ingredients states
    const [ingredients, setIngredients] = useState([]); // array de ingredientes
    const [ingredientInput, setIngredientInput] = useState(""); // input controlado
    const [cantidadInput, setCantidadInput] = useState("");
    const [medidaInput, setMedidaInput] = useState("");
    const medidaOptions = ["g", "kg", "ml", "l", "pieza(s)", "taza", "cda", "cdita", "rebanada", "lata"];

    //Add handlers for the chip component, to handle the click and delete events
    const handleAddIngredient = () => {
        if (ingredientInput.trim() && cantidadInput.trim() && medidaInput.trim()) {
            setIngredients([
                ...ingredients,
                //Create the ingredient object 
                {
                    cantidad: cantidadInput.trim(),
                    medida: medidaInput.trim(),
                    ingrediente: ingredientInput.trim()
                }
            ]);
            //Clear inputs
            setIngredientInput("");
            setCantidadInput("");
            setMedidaInput("");
        }
    };

    //Delete handler for the chip component, to remove the ingredient from the list
    const handleDeleteIngredient = (idx) => {
        setIngredients(ingredients.filter((_, i) => i !== idx));
    };
    return (
        < div style={createRecipe}>
            <TextField label="Cantidad de porciones" size="small" type="number" />
            <TextField id="recipe-name" label="Nombre de la receta" variant="outlined" />
            <h4>Ingredientes:</h4>
            {/* Added ingredients */}
            <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginBottom: "8px" }}>
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
              <div>
                 <TextField
                    label="Ingrediente"
                    value={ingredientInput}
                    onChange={e => setIngredientInput(e.target.value)}
                    size="large"
                    style={{ width: 180 }}
                />
              </div>
              <br />
              <div  style={{display:'flex', flexDirection:'row'}}> <TextField
                    label="Cantidad"
                    value={cantidadInput}
                    onChange={e => setCantidadInput(e.target.value)}
                    type="number"
                    size="small"
                    style={{ width: 100 }}
                />
                <Autocomplete
                    disablePortal
                    options={medidaOptions}
                    value={medidaInput}
                    onChange={(_, newValue) => setMedidaInput(newValue || "")}
                    sx={{ width: 120 }}
                    renderInput={(params) => <TextField {...params} label="Medida" size="small" />}
                /></div>
               
                <br />
                <Button sx={{ width: 150 }} variant="outlined" onClick={handleAddIngredient}>Agregar</Button>
            </div>
                
            <h4>Instrucciones:</h4>
            {/* TODO: add instructions state and handlers */}
            <List sx={stepsStyle}>
                <ListItem>
                    <ListItemText primary="Full width variant below" />
                </ListItem>
                <Divider component="li" />
                <ListItem>
                    <ListItemText primary="Inset variant below" />
                </ListItem>
                <Divider variant="inset" component="li" />
                <ListItem>
                    <ListItemText primary="Middle variant below" />
                </ListItem>
                <Divider variant="middle" component="li" />
                <ListItem>
                    <ListItemText primary="List item" />
                </ListItem>
            </List>
            <div style={createRecipe}>
                {/* TODO: add instructions */}
                <TextField id="recipe-instructions" label="Paso: " variant="outlined" />
                <Button sx={{ width: 150 }} variant="outlined" >Agregar</Button>
            </div>
            <h4>Imágen:</h4>
        </div>
    )
}