import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';

export default function AddIngredientInputs({
    ingredientOptions,
    ingredientInput,
    setIngredientInput,
    cantidadInput,
    setCantidadInput,
    medidaInput,
    setMedidaInput,
    medidaOptions,
    fieldErrors,
}) {
    const addIngredientStyle = {
        display: 'flex',
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: '8px',
        marginBottom: '8px',
    };

    return (
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
                sx={{ width: '50%', minWidth: 200 }}
                renderInput={(params) => (
                    <TextField
                        {...params}
                        label="Ingrediente"
                        size="small"
                        type="text"
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
                style={{ width: 100 }}
                error={fieldErrors.cantidad}
                helperText={fieldErrors.cantidad ? 'Agrega cantidad' : ''}
                inputProps={{ min: 1 }}
            />
            <Autocomplete
                disablePortal
                options={medidaOptions}
                value={medidaInput}
                onChange={(_, newValue) => setMedidaInput(newValue || '')}
                sx={{ width: 220 }}
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
    );
}
