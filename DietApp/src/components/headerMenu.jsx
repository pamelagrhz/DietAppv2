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
import Avatar from '@mui/material/Avatar';
import { red } from '@mui/material/colors';


export default function HeaderMenu({ onMenuOptionClick }) {
  const [open, setOpen] = React.useState(false);

  // Menu options
  const userOptions = [
    {  label: 'Profile' },
    {  label: 'My account' },
    {  label: 'Logout' },
    {  label: 'Settings' },
    {  label: 'Help' }
  ];
  const helloKitchenOptions = [
    { label: 'New recipe', action: 'newRecipe' },
    { label: 'Recipes', action: 'recipes' },
    { label: 'Meal Plans', action: 'mealPlans' },
    { label: 'Grocery Lists', action: 'groceryLists' },
  ];

  // Actions
  const handleOptionClick = (action) => () => {
    if (onMenuOptionClick) {
      onMenuOptionClick(action);
    }
    setOpen(false);
  };

  const toggleDrawer = (newOpen) => () => {
    setOpen(newOpen);
  };
  const openProfile = (newOpen) => () => {
    console.log('open profile section')
  }

  //Styles
  const headerStyle = {
    backgroundColor: 'var(--ligth-200-color)',
    display: 'flex',
    padding: '10px',
    justifyContent: 'space-between',
    position: 'sticky',
    top: 0,
    zIndex: 1100,
    width: '100%',
  };

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
          <ListItem key={text.label} disablePadding>
            <ListItemButton onClick={toggleDrawer(false)}>
              <ListItemText primary={text.label} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <div style={headerStyle}>
      <Button
        onClick={toggleDrawer(true)}
        // Styles to remove focus outline
        sx={{
          '&:focus': { outline: 'none' },
          '&.Mui-focusVisible': { outline: 'none' },
        }}
      >
        <MenuIcon />
      </Button>
      <Button onClick={openProfile(true)}>

                <Avatar sx={{ bgcolor: red[500], marginRight: '8px' }} aria-label="recipe">
                R
              </Avatar>
      </Button>
      <Drawer open={open} onClose={toggleDrawer(false)}>
        {DrawerList}
      </Drawer>
    </div>
  );
}