import TextField from '@mui/material/TextField';
import { Button } from '@mui/material';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';

export default function AddStepsSection({
    steps,
    stepInput,
    setStepInput,
    fieldErrors,
    onAddStep,
    onDeleteStep,
}) {
    const createRecipeStyle = {
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem',
    };

    const stepsStyle = {
        py: 0,
        width: '100%',
        borderRadius: 2,
        border: '1px solid',
        borderColor: 'divider',
        backgroundColor: 'background.paper',
        fontSize: '0.92rem',
        maxHeight: 150,
        overflowY: 'auto',
    };

    return (
        <>
            <h3>Instrucciones:</h3>
            <List
                style={{ display: steps.length > 0 ? 'block' : 'none' }}
                sx={stepsStyle}
                subheader={
                    <li style={{ position: 'sticky', top: 0, background: '#fff', zIndex: 1 }}>
                    </li>
                }
            >
                {steps.map((step, idx) => (
                    <ListItem
                        key={idx}
                        secondaryAction={
                            <Button
                                color="error"
                                size="small"
                                onClick={() => onDeleteStep(idx)}
                                sx={{ minWidth: 0, width: 24, height: 24, p: 0, borderRadius: '50%', fontSize: '1rem' }}
                            >
                                ×
                            </Button>
                        }
                        sx={{ py: 0.2, minHeight: 32 }}
                    >
                        <ListItemText
                            sx={{ width: '100%' }}
                            primary={`${idx + 1}.- ${step}`}
                            primaryTypographyProps={{ fontSize: '0.92rem' }}
                        />
                    </ListItem>
                ))}
            </List>

            <div style={createRecipeStyle}>
                <TextField
                    id="recipe-instructions"
                    label="Paso: "
                    variant="outlined"
                    size="small"
                    value={stepInput}
                    onChange={(e) => setStepInput(e.target.value)}
                    error={fieldErrors.steps}
                    helperText={fieldErrors.steps ? 'Agrega al menos un paso' : ''}
                />
                <Button size="small" sx={{ width: 100 }} variant="outlined" onClick={onAddStep}>
                    Agregar
                </Button>
            </div>
        </>
    );
}
