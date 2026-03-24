import NumberField from '@mui/material/TextField';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import { Button } from '@mui/material';
export default function CreateRecipe() {
    const createRecipe = {
        display: "flex",
        flexDirection: "column",
        gap: "1rem",
    }

    const addIngredient = {
        display: "flex",
        flexDirection: "row",
    }
    const ingredients = []
    return (
        < div style={createRecipe}>
            <NumberField label="Cantidad de porciones" size="small" type='number' />
            <TextField id="recipe-name" label="Nombre de la receta" variant="outlined" />
            <h4>Ingredientes:</h4>
            <div style={addIngredient}>
                {/* TODO: add autocomplete for ingredients, with the option to add new ones if they don't exist in the database */}
                <Autocomplete
                    disablePortal
                    options={ingredients} 
                    sx={{ width: 300 }}
                    renderInput={(params) => <TextField {...params} label="Ingredientes" />}
                />
                <Button sx={{ width: 150 }} variant="outlined">Agregar</Button>
            </div>
            <h4>Instrucciones:</h4>
            <div style={createRecipe}>
                {/* TODO: add instructions */}
                <TextField id="recipe-instructions" label="Paso: " variant="outlined" />
                <Button sx={{ width: 150 }} variant="outlined">Agregar</Button>
            </div>
            <h4>Imágen:</h4>
        </div>
    )
}