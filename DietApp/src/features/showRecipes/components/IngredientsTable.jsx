import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';

export default function IngredientsList({ ingredients }) {

    return(
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>Ingrediente</TableCell>
            <TableCell >Cantidad</TableCell>
            <TableCell >Medida</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          
          {ingredients.map((ing, i) => (
            <TableRow
              key={i}
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
              <TableCell >{ing.ingrediente}</TableCell>
              <TableCell >{ing.cantidad}</TableCell>
              <TableCell >{ing.medida}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    )
}