import IngredientsList from "./IngredientsTable";
import InstructionsList from "./InstructionsList";
import Button from '@mui/material/Button';
import Rating from '@mui/material/Rating';
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";


export default function RecipeAcordion({ recipe }) {

  const cardContent = {}
  const cardTitle = {
    margin: '18px',
    fontSize: '1.5em',
    marginBottom: '8px',
    color: '#133f9c',
  }

  if (!recipe) return null;
  return (
    <Accordion>
    <AccordionSummary>
        {/* TODO: Insert image */}
        <h2 style={cardTitle}>{recipe.nombre} </h2>
    </AccordionSummary>

    <AccordionDetails>
        <IngredientsList ingredients={recipe.ingredientes} />
         <InstructionsList instructions={recipe.preparacion} />
     </AccordionDetails>
    </Accordion>
  );
}
