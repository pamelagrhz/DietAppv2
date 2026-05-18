import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { useState } from 'react';

import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
// colors
import { red, blue } from '@mui/material/colors';


export default function EditIngredient({ ingredients, onDeleteIngredient }) {
    const [editingIndex, setEditingIndex] = useState(null);
    const [editValues, setEditValues] = useState({});

    const edit = (index, ingredient) => {
        setEditingIndex(index);
        setEditValues({ ...ingredient });
    };
    const saveEdits = (index, newValues) => { 
        // Implement save logic here
        console.log('Saving edits for index:', index, 'with values:', newValues);
        setEditingIndex(null);
    }

    const buttonStyles = {
        maxHeight: '16px',
        maxWidth: '16px',
        marginLeft: '4px',
        borderRadius: '4px',
        cursor: 'pointer',
    };

    return (
        <>
        <ol>
            {ingredients.map((ing, idx) => (
                <li key={idx}>
                    {editingIndex === idx ? (

                        <div>

                            {/* Edit an ingredient */}
                            {/* TODO: change dropdown for medida and autocomplete for ingrediente */}
                            <input
                                type="text"
                                value={editValues.cantidad ?? ''}
                                onChange={(e) => setEditValues({ ...editValues, cantidad: e.target.value })}
                            /> 
                            <input
                                type="text"
                                value={editValues.medida ?? ''}
                                onChange={(e) => setEditValues({ ...editValues, medida: e.target.value })}
                            />
                            <input
                                type="text"
                                value={editValues.ingrediente ?? ''}
                                onChange={(e) => setEditValues({ ...editValues, ingrediente: e.target.value })}
                            />
                            <button onClick={() => setEditingIndex(null)}>X</button>
                            <button onClick={() => {saveEdits(idx, editValues)}}>Save</button>
                        </div>
                    ) : (
                        //TODO: Fix the view
                        // Show ingredient details with edit and delete icons
                        <Table>
                        <TableBody>
                            <TableRow>
                                <TableCell >
                                    <span style={{
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis',
                                        whiteSpace: 'nowrap',
                                        display: 'block',
                                        width: '50%'
                                        }}>{`${ing.ingrediente}`} </span>
                                        {`${ing.cantidad} ${ing.medida}`}</TableCell>
                                <TableCell align="right">
                                    <EditIcon style={buttonStyles} fontSize="small" sx={{color: blue[500]}} onClick={() => edit(idx, ing)}/>
                                    <DeleteIcon style={buttonStyles} fontSize="small"  sx={{color: red[500]}} onClick={() => onDeleteIngredient(idx)}/>
                                </TableCell>
                            </TableRow>
                        </TableBody>
                        </Table>
                        
                    )}
                </li>
            ))}
        </ol>
        </>
    );
}