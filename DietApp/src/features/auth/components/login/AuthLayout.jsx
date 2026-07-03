import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import BottomNavigation from '@mui/material/BottomNavigation';
import BottomNavigationAction from '@mui/material/BottomNavigationAction';
import LoginIcon from '@mui/icons-material/Login';
import PersonAddIcon from '@mui/icons-material/PersonAdd';

export default function AuthLayout() {
  const location = useLocation();
  const navigate = useNavigate();

  const tab = location.pathname === '/register' ? 1 : 0;

  const handleTabChange = (event, newValue) => {
    if (newValue === 0) {
      navigate('/login');
    } else {
      navigate('/register');
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'var(--ligth-200-color)',
        padding: 2,
      }}
    >
      <Paper
        elevation={4}
        sx={{
          width: '100%',
          maxWidth: 420,
          overflow: 'hidden',
          backgroundColor: 'var(--ligth-color)',
        }}
      >
        <Box sx={{ padding: 3, paddingBottom: 1 }}>
          <Typography
            variant="h4"
            component="h1"
            textAlign="center"
            sx={{ color: 'var(--green-color)', fontWeight: 600 }}
          >
            DietApp
          </Typography>
        </Box>

        <BottomNavigation
          showLabels
          value={tab}
          onChange={handleTabChange}
          sx={{
            backgroundColor: 'var(--green-color)',
            '& .MuiBottomNavigationAction-root': {
              color: 'var(--ligth-200-color)',
            },
            '& .Mui-selected': {
              color: 'var(--beige-color)',
            },
          }}
        >
          <BottomNavigationAction label="Iniciar sesión" icon={<LoginIcon />} />
          <BottomNavigationAction label="Registrarse" icon={<PersonAddIcon />} />
        </BottomNavigation>

        <Box sx={{ padding: 3 }}>
          <Outlet />
        </Box>
      </Paper>
    </Box>
  );
}
