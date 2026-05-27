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
            <Table sx={{ width: '100%', tableLayout: { xs: 'auto', sm: 'fixed' } }}>
                <TableBody>
                    {ingredients.map((ing, idx) => (
                        <TableRow
                            key={idx}
                            sx={{
                                display: { xs: 'block', sm: 'table-row' },
                                borderBottom: '1px solid',
                                borderColor: 'divider',
                                py: { xs: 1, sm: 0 },
                            }}
                        >
                            {editingIndex === idx ? (
                                <>
                                    <TableCell
                                        sx={{
                                            display: { xs: 'block', sm: 'table-cell' },
                                            width: { xs: '100%', sm: '46%' },
                                            borderBottom: { xs: 'none', sm: undefined },
                                            px: { xs: 0, sm: 2 },
                                            py: { xs: 0.75, sm: 2 },
                                        }}
                                    >
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
                                    <TableCell
                                        sx={{
                                            display: { xs: 'block', sm: 'table-cell' },
                                            width: { xs: '100%', sm: '34%' },
                                            borderBottom: { xs: 'none', sm: undefined },
                                            px: { xs: 0, sm: 2 },
                                            py: { xs: 0.75, sm: 2 },
                                        }}
                                    >
                                        <Box sx={{ display: 'flex', gap: 1, flexDirection: { xs: 'column', sm: 'row' } }}>
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
                                                sx={{ width: { xs: '100%', sm: 90 } }}
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
                                                sx={{ width: { xs: '100%', sm: 130 } }}
                                            />
                                        </Box>
                                    </TableCell>
                                    <TableCell
                                        align="right"
                                        sx={{
                                            display: { xs: 'block', sm: 'table-cell' },
                                            width: { xs: '100%', sm: '20%' },
                                            whiteSpace: 'nowrap',
                                            borderBottom: { xs: 'none', sm: undefined },
                                            px: { xs: 0, sm: 2 },
                                            py: { xs: 0.75, sm: 2 },
                                            textAlign: { xs: 'left', sm: 'right' },
                                        }}
                                    >
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
                                    <TableCell
                                        sx={{
                                            display: { xs: 'block', sm: 'table-cell' },
                                            width: { xs: '100%', sm: '70%' },
                                            borderBottom: { xs: 'none', sm: undefined },
                                            px: { xs: 0, sm: 2 },
                                            py: { xs: 0.75, sm: 2 },
                                        }}
                                    >
                                        <Box
                                            sx={{
                                                overflow: 'hidden',
                                                textOverflow: 'ellipsis',
                                                whiteSpace: { xs: 'normal', sm: 'nowrap' },
                                                wordBreak: 'break-word',
                                            }}
                                            title={ing.ingrediente}
                                        >
                                            {ing.ingrediente}
                                        </Box>
                                    </TableCell>
                                    <TableCell
                                        align="right"
                                        sx={{
                                            display: { xs: 'block', sm: 'table-cell' },
                                            width: { xs: '100%', sm: '20%' },
                                            borderBottom: { xs: 'none', sm: undefined },
                                            px: { xs: 0, sm: 2 },
                                            py: { xs: 0.5, sm: 2 },
                                            textAlign: { xs: 'left', sm: 'right' },
                                        }}
                                    >
                                        <Box
                                            sx={{
                                                overflow: 'hidden',
                                                textOverflow: 'ellipsis',
                                                whiteSpace: { xs: 'normal', sm: 'nowrap' },
                                                wordBreak: 'break-word',
                                            }}
                                            title={`${ing.cantidad} ${ing.medida}`}
                                        >
                                            {`${ing.cantidad} ${ing.medida}`}
                                        </Box>
                                    </TableCell>
                                    <TableCell
                                        align="right"
                                        sx={{
                                            display: { xs: 'block', sm: 'table-cell' },
                                            width: { xs: '100%', sm: '10%' },
                                            whiteSpace: 'nowrap',
                                            borderBottom: { xs: 'none', sm: undefined },
                                            px: { xs: 0, sm: 2 },
                                            py: { xs: 0.5, sm: 2 },
                                            textAlign: { xs: 'left', sm: 'right' },
                                        }}
                                    >
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