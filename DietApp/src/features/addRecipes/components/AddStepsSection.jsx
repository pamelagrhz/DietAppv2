import React from 'react';
import TextField from '@mui/material/TextField';


export default function AddStepsSection({
    instructionsText,
    setInstructionsText,
    fieldErrors,
}) {
    return (
        <>
            <h3 style={{ margin: 0, marginBottom: 8, fontSize: '1.75rem', color: '#1e4033', fontFamily: 'Bitter, Cambria, Georgia, serif' }}>Instrucciones</h3>
            <TextField
                id="recipe-instructions"
                label="Instrucciones"
                variant="outlined"
                size="small"
                multiline
                minRows={5}
                value={instructionsText}
                onChange={(e) => setInstructionsText(e.target.value)}
                error={fieldErrors.steps}
                helperText={fieldErrors.steps ? 'Agrega las instrucciones de la receta' : ''}
                fullWidth
            />
        </>
    );
}
