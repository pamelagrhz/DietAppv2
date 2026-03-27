import NumberField from '@mui/material/TextField';
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
        flexDirection: "row",
    }

    // states
    const [ingredients, setIngredients] = useState([]); // array de ingredientes
    const [ingredientInput, setIngredientInput] = useState(""); // input controlado

    //Add handlers for the chip component, to handle the click and delete events
    const handleAddIngredient = () => {
        if (ingredientInput !== "") {
            setIngredients([...ingredients, ingredientInput]);
            console.log('agregado ingrediente: ', ingredientInput);
            setIngredientInput("");
        }
    }

    //chip function
    const handleDeleteIngredient = (ingredient) => {
        setIngredients(ingredients.filter((ing) => ing !== ingredient));
    };
    return (
        < div style={createRecipe}>
            <NumberField label="Cantidad de porciones" size="small" type='number' />
            <TextField id="recipe-name" label="Nombre de la receta" variant="outlined" />
            <h4>Ingredientes:</h4>
            <div >
                {/* TODO: add autocomplete for ingredients, with the option to add new ones if they don't exist in the database */}
                <ListItem>
                {ingredients.map((ing, idx) => (
                    // TODO: listItem styles
                    <Chip
                        key={idx}
                        label={ing}
                        onDelete={() => handleDeleteIngredient(ing)}
                    />
                ))}
                </ListItem>
                <div style={addIngredient}>
                    {/* TODO:Add the autocomplete */}
                    <TextField label="Ingredientes" value={ingredientInput} onChange={(e) => setIngredientInput(e.target.value)} />
                    <Button sx={{ width: 150 }} variant="outlined" onClick={handleAddIngredient}>Agregar</Button></div>
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