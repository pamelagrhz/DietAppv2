import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import Typography from '@mui/material/Typography';
import { logout } from '../../../services/auth.service.js';

export default function Logout() {
  const navigate = useNavigate();

  useEffect(() => {
    let cancelled = false;

    async function doLogout() {
      try {
        await logout();
      } catch {
        // Incluso si el backend falla, limpiamos localStorage en el servicio.
      } finally {
        if (!cancelled) {
          navigate('/login', { replace: true });
        }
      }
    }

    doLogout();

    return () => {
      cancelled = true;
    };
  }, [navigate]);

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 2,
        minHeight: '50vh',
      }}
    >
      <CircularProgress />
      <Typography variant="body1" color="text.secondary">
        Cerrando sesión...
      </Typography>
    </Box>
  );
}
