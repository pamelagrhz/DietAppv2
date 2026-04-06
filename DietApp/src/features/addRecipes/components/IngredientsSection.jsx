import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import Chip from '@mui/material/Chip';
import { Button } from '@mui/material';

export default function IngredientsSection({
    ingredients,
    ingredientOptions,
    ingredientInput,
    setIngredientInput,
    cantidadInput,
    setCantidadInput,
    medidaInput,
    setMedidaInput,
    medidaOptions,
    fieldErrors,
    onAddIngredient,
    onDeleteIngredient,
}) {
    const addIngredientStyle = {
        display: 'flex',
        flexDirection: 'row',
    };

    return (
        <>
            Ingredientes:
            <div
                style={{
                    display: ingredients.length > 0 ? 'flex' : 'none',
                    flexWrap: 'wrap',
                    gap: '8px',
                    marginBottom: '8px',
                }}
            >
                {ingredients.map((ing, idx) => (
                    <Chip
                        key={idx}
                        label={`${ing.cantidad} ${ing.medida} ${ing.ingrediente}`}
                        onDelete={() => onDeleteIngredient(idx)}
                        style={{ margin: 4 }}
                    />
                ))}
            </div>

            <div style={addIngredientStyle}>
                <Autocomplete
                    freeSolo
                    options={ingredientOptions}
                    inputValue={ingredientInput}
                    onChange={(_, newValue) => setIngredientInput(typeof newValue === 'string' ? newValue : '')}
                    onInputChange={(_, newInputValue, reason) => {
                        if (reason === 'reset') return;
                        setIngredientInput(newInputValue || '');
                    }}
                    clearOnBlur={false}
                    sx={{ width: '50%' }}
                    renderInput={(params) => (
                        <TextField
                            {...params}
                            label="Ingrediente"
                            size="small"
                            error={fieldErrors.ingredients}
                            helperText={fieldErrors.ingredients ? 'Agrega al menos un ingrediente' : ''}
                        />
                    )}
                />
                <TextField
                    label="Cantidad"
                    value={cantidadInput}
                    onChange={(e) => {
                        const val = e.target.value;
                        if (val === '') {
                            setCantidadInput('');
                            return;
                        }

                        const numericValue = Number(val);
                        if (!Number.isNaN(numericValue) && numericValue >= 0) {
                            setCantidadInput(val);
                        }
                    }}
                    type="number"
                    size="small"
                    style={{ width: 80 }}
                    error={fieldErrors.cantidad}
                    helperText={fieldErrors.cantidad ? 'Agrega cantidad' : ''}
                    inputProps={{ min: 1 }}
                />
                <Autocomplete
                    disablePortal
                    options={medidaOptions}
                    value={medidaInput}
                    style={{ width: 100 }}
                    onChange={(_, newValue) => setMedidaInput(newValue || '')}
                    sx={{ width: 120 }}
                    renderInput={(params) => (
                        <TextField
                            {...params}
                            label="Medida"
                            size="small"
                            error={fieldErrors.medida}
                            helperText={fieldErrors.medida ? 'Agrega medida' : ''}
                        />
                    )}
                />
            </div>

            <Button size="small" sx={{ width: 100 }} variant="outlined" onClick={onAddIngredient}>
                Agregar
            </Button>
        </>
    );
}
