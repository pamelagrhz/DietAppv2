import { useEffect, useState } from 'react';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
// colors
import { green, red } from '@mui/material/colors';
import Box from '@mui/material/Box';


export default function EditIngredient({
    ingredients,
    ingredientOptions,
    medidaOptions,
    onDeleteIngredient,
    onUpdateIngredient,
}) {
    const [editingIndex, setEditingIndex] = useState(null);
    const [editingIngredient, setEditingIngredient] = useState('');
    const [editingCantidad, setEditingCantidad] = useState('');
    const [editingMedida, setEditingMedida] = useState('');
    const [hasEditError, setHasEditError] = useState(false);

    useEffect(() => {
        if (editingIndex !== null && editingIndex >= ingredients.length) {
            setEditingIndex(null);
            setHasEditError(false);
        }
    }, [editingIndex, ingredients.length]);

    const startEdit = (idx, ingredient) => {
        setEditingIndex(idx);
        setEditingIngredient(ingredient.ingrediente || '');
        setEditingCantidad(String(ingredient.cantidad ?? ''));
        setEditingMedida(ingredient.medida || '');
        setHasEditError(false);
    };

    const cancelEdit = () => {
        setEditingIndex(null);
        setHasEditError(false);
    };

    const saveEdit = () => {
        const normalizedIngredient = editingIngredient.trim();
        const normalizedMedida = editingMedida.trim();
        const numericCantidad = Number(editingCantidad);

        if (
            !normalizedIngredient ||
            editingCantidad === '' ||
            !normalizedMedida ||
            Number.isNaN(numericCantidad) ||
            numericCantidad < 0
        ) {
            setHasEditError(true);
            return;
        }

        onUpdateIngredient(editingIndex, {
            ingrediente: normalizedIngredient,
            cantidad: numericCantidad,
            medida: normalizedMedida,
        });
        setEditingIndex(null);
        setHasEditError(false);
    };

    return (
        <>
            <Table sx={{ width: '100%', tableLayout: 'fixed' }}>
                <TableBody>
                    {ingredients.map((ing, idx) => (
                        <TableRow key={idx}>
                            {editingIndex === idx ? (
                                <>
                                    <TableCell sx={{ width: '46%' }}>
                                        <Autocomplete
                                            freeSolo
                                            options={ingredientOptions}
                                            inputValue={editingIngredient}
                                            onChange={(_, newValue) => setEditingIngredient(typeof newValue === 'string' ? newValue : '')}
                                            onInputChange={(_, newInputValue, reason) => {
                                                if (reason === 'reset') return;
                                                setEditingIngredient(newInputValue || '');
                                            }}
                                            clearOnBlur={false}
                                            renderInput={(params) => (
                                                <TextField
                                                    {...params}
                                                    label="Ingrediente"
                                                    size="small"
                                                    error={hasEditError && !editingIngredient.trim()}
                                                />
                                            )}
                                        />
                                    </TableCell>
                                    <TableCell sx={{ width: '34%' }}>
                                        <Box sx={{ display: 'flex', gap: 1 }}>
                                            <TextField
                                                label="Cantidad"
                                                value={editingCantidad}
                                                onChange={(e) => {
                                                    const val = e.target.value;
                                                    if (val === '') {
                                                        setEditingCantidad('');
                                                        return;
                                                    }

                                                    const numericValue = Number(val);
                                                    if (!Number.isNaN(numericValue) && numericValue >= 0) {
                                                        setEditingCantidad(val);
                                                    }
                                                }}
                                                type="number"
                                                size="small"
                                                sx={{ width: 90 }}
                                                error={hasEditError && editingCantidad === ''}
                                                inputProps={{ min: 1 }}
                                            />
                                            <Autocomplete
                                                disablePortal
                                                options={medidaOptions}
                                                value={editingMedida}
                                                onChange={(_, newValue) => setEditingMedida(newValue || '')}
                                                renderInput={(params) => (
                                                    <TextField
                                                        {...params}
                                                        label="Medida"
                                                        size="small"
                                                        error={hasEditError && !editingMedida.trim()}
                                                    />
                                                )}
                                                sx={{ width: 130 }}
                                            />
                                        </Box>
                                    </TableCell>
                                    <TableCell align="right" sx={{ width: '20%', whiteSpace: 'nowrap' }}>
                                        <IconButton
                                            size="small"
                                            aria-label="guardar ingrediente"
                                            sx={{ color: green[600] }}
                                            onClick={saveEdit}
                                        >
                                            <CheckIcon fontSize="small" />
                                        </IconButton>
                                        <IconButton
                                            size="small"
                                            aria-label="cancelar edicion"
                                            onClick={cancelEdit}
                                        >
                                            <CloseIcon fontSize="small" />
                                        </IconButton>
                                        <IconButton
                                            size="small"
                                            aria-label="eliminar ingrediente"
                                            sx={{ color: red[500] }}
                                            onClick={() => onDeleteIngredient(idx)}
                                        >
                                            <DeleteIcon fontSize="small" />
                                        </IconButton>
                                    </TableCell>
                                </>
                            ) : (
                                <>
                                    <TableCell sx={{ width: '70%' }}>
                                        <Box
                                            sx={{
                                                overflow: 'hidden',
                                                textOverflow: 'ellipsis',
                                                whiteSpace: 'nowrap',
                                            }}
                                            title={ing.ingrediente}
                                        >
                                            {ing.ingrediente}
                                        </Box>
                                    </TableCell>
                                    <TableCell align="right" sx={{ width: '20%' }}>
                                        <Box
                                            sx={{
                                                overflow: 'hidden',
                                                textOverflow: 'ellipsis',
                                                whiteSpace: 'nowrap',
                                            }}
                                            title={`${ing.cantidad} ${ing.medida}`}
                                        >
                                            {`${ing.cantidad} ${ing.medida}`}
                                        </Box>
                                    </TableCell>
                                    <TableCell align="right" sx={{ width: '10%', whiteSpace: 'nowrap' }}>
                                        <IconButton
                                            size="small"
                                            aria-label="editar ingrediente"
                                            onClick={() => startEdit(idx, ing)}
                                        >
                                            <EditIcon fontSize="small" />
                                        </IconButton>
                                        <IconButton
                                            size="small"
                                            aria-label="eliminar ingrediente"
                                            sx={{ color: red[500] }}
                                            onClick={() => onDeleteIngredient(idx)}
                                        >
                                            <DeleteIcon fontSize="small" />
                                        </IconButton>
                                    </TableCell>
                                </>
                            )}
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </>
    );
}