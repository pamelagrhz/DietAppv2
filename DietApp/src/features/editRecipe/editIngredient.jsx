import DeleteIcon from '@mui/icons-material/Delete';

import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
// colors
import { red } from '@mui/material/colors';
import Box from '@mui/material/Box';


export default function EditIngredient({ ingredients, onDeleteIngredient }) {
    const buttonStyles = {
        maxHeight: '16px',
        maxWidth: '16px',
        marginLeft: '4px',
        borderRadius: '4px',
        cursor: 'pointer',
    };

    return (
        <>
            <Table sx={{ width: '100%', tableLayout: 'fixed' }}>
                <TableBody>
                    {ingredients.map((ing, idx) => (
                        <TableRow key={idx}>
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
                            <TableCell align="right" sx={{ width: '20%', whiteSpace: 'nowrap' }}>
                                {`${ing.cantidad} ${ing.medida}`}
                            </TableCell>
                            <TableCell align="right" sx={{ width: '10%', whiteSpace: 'nowrap' }}>
                                <DeleteIcon style={buttonStyles} fontSize="small" sx={{ color: red[500] }} onClick={() => onDeleteIngredient(idx)} />
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </>
    );
}