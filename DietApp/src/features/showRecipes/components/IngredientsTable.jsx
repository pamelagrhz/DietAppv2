import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';

export default function IngredientsList({ ingredients }) {

    return(
      <Table sx={{ minWidth: 300 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>Ingredientes</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          
          {ingredients.map((ing, i) => (
            <TableRow
              key={i}
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
              <TableCell >{i + 1}. {ing.cantidad} {ing.medida} de {ing.ingrediente}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    )
}