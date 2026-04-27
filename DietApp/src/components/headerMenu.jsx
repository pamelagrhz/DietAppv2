import * as React from 'react';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import Button from '@mui/material/Button';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import MenuIcon from '@mui/icons-material/Menu';

export default function HeaderMenu({ onMenuOptionClick }) {
  const [open, setOpen] = React.useState(false);

  const userOptions = ['Profile', 'My account', 'Logout'];
  const helloKitchenOptions = [
    { label: 'New recipe', action: 'newRecipe' },
    { label: 'Recipes', action: 'recipes' },
    { label: 'Meal Plans', action: 'mealPlans' },
    { label: 'Grocery Lists', action: 'groceryLists' },
  ];

  const handleOptionClick = (action) => () => {
    if (onMenuOptionClick) {
      onMenuOptionClick(action);
    }
    setOpen(false);
  };

  const toggleDrawer = (newOpen) => () => {
    setOpen(newOpen);
  };

  //Styles
  const headerStyle = {
    backgroundColor: 'var(--ligth-200-color)',
    display: 'flex',
    padding: '10px',
  }

  const DrawerList = (
    <Box sx={{ width: 250 }} role="presentation">
      <List>
        {helloKitchenOptions.map((option) => (
          <ListItem key={option.label} disablePadding>
            <ListItemButton onClick={handleOptionClick(option.action)}>
              <ListItemText primary={option.label} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      <Divider />
      <List>
        {userOptions.map((text) => (
          <ListItem key={text} disablePadding>
            <ListItemButton onClick={toggleDrawer(false)}>
              <ListItemText primary={text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <div style={headerStyle}>
      {/* TODO: Add icons to the menu options
      TODO: Change text to an hamburguer icon */}
      <Button onClick={toggleDrawer(true)}>
        {/* TODO: Remove focus style from this icon */}
        <MenuIcon />
      </Button>
      <Drawer open={open} onClose={toggleDrawer(false)}>
        {DrawerList}
      </Drawer>
    </div>
  );
}