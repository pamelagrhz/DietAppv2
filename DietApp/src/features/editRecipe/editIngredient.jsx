import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { useState } from 'react';

export default function EditIngredient({ ingredients }) {
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
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            {`${ing.cantidad} ${ing.medida} ${ing.ingrediente}`}
                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                <EditIcon style={{ cursor: 'hand' }} fontSize="small" onClick={() => edit(idx, ing)}/>
                                <DeleteIcon style={{ cursor: 'hand' }} fontSize="small" onClick={() => console.log('delete ingredient', idx)}/>
                            </div>
                            </div>
                    )}
                </li>
            ))}
        </ol>
        </>
    );
}