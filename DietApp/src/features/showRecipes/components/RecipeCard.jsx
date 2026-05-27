import * as React from 'react';
import { styled } from '@mui/material/styles';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Collapse from '@mui/material/Collapse';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Tooltip from '@mui/material/Tooltip';
import { red } from '@mui/material/colors';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ShareIcon from '@mui/icons-material/Share';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import IngredientsList from "./IngredientsTable";
import ShowStepsList from "./ShowStepsList";
import pizzaImage from '../../../assets/images/pizza.jpg';

const ExpandMore = styled((props) => {
  const { expand, ...other } = props;
  return <IconButton {...other} />;
})(({ theme, expand }) => ({
  marginLeft: 'auto',
  transition: theme.transitions.create('transform', {
    duration: theme.transitions.duration.shortest,
  }),
  transform: expand ? 'rotate(180deg)' : 'rotate(0deg)',
}));

export default function RecipeReviewCard({ recipe }) {
  const [expanded, setExpanded] = React.useState(false);

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };
  const cardsStyles = {
   minWidth: '345px',
  };

  return (
    <Card sx={{ maxWidth: 345 }} style={cardsStyles}>
      <CardHeader
        avatar={
          <Avatar sx={{ bgcolor: red[500] }} aria-label="recipe">
            R
          </Avatar>
        }
        action={
          <IconButton aria-label="settings">
            <MoreVertIcon />
          </IconButton>
        }
        title={(
          <Tooltip title={recipe.nombre || ''} arrow>
            <Typography
              variant="subtitle1"
              noWrap
              sx={{
                fontSize: '1rem',
                lineHeight: 1.2,
                maxWidth: 170,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}
            >
              {recipe.nombre}
            </Typography>
          </Tooltip>
        )}
        subheader={recipe.userId}
        
      />
      <CardMedia
        component="img"
        height="194"
        image={pizzaImage}
        alt={recipe.nombre}
      />
      <CardContent>
        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          Here we can add an excerpt of the recipe, or a short description. This is just placeholder text to show how it would look like.
        </Typography>
      </CardContent>
      <CardActions disableSpacing>
        <IconButton aria-label="add to favorites">
          <FavoriteIcon />
        </IconButton>
        <IconButton aria-label="share">
          <ShareIcon />
        </IconButton>
        <ExpandMore
          expand={expanded}
          onClick={handleExpandClick}
          aria-expanded={expanded}
          aria-label="show more"
        >
          <ExpandMoreIcon />
        </ExpandMore>
      </CardActions>
      <Collapse in={expanded} timeout="auto" unmountOnExit>
        <CardContent>
 <IngredientsList ingredients={recipe.ingredientes} />
         <ShowStepsList instructions={recipe.preparacion} />
                 </CardContent>
      </Collapse>
    </Card>
  );
}