import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Alert from '@mui/material/Alert';
import PasswordField from '../common/PasswordField.jsx';
import { login } from '../../../../services/auth.service.js';

export default function LoginForm() {
  const navigate = useNavigate();
  const [loginUser, setLoginUser] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const isFormValid = useMemo(() => {
    return loginUser.trim().length > 0 && loginPassword.trim().length > 0;
  }, [loginUser, loginPassword]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!isFormValid || loading) return;

    setError('');
    setLoading(true);

    try {
      await login(loginUser, loginPassword);
      navigate('/');
    } catch (err) {
      setError(err.message || 'Error al iniciar sesión');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <Typography variant="h6" sx={{ color: 'var(--dark-gray-color)' }}>
        Bienvenido de nuevo
      </Typography>

      {error && <Alert severity="error">{error}</Alert>}

      <TextField
        label="Usuario o correo"
        value={loginUser}
        onChange={(e) => setLoginUser(e.target.value)}
        fullWidth
        required
        autoFocus
      />

      <PasswordField
        label="Contraseña"
        value={loginPassword}
        onChange={(e) => setLoginPassword(e.target.value)}
      />

      <Button
        type="submit"
        variant="contained"
        size="large"
        fullWidth
        disabled={!isFormValid || loading}
        sx={{
          backgroundColor: 'var(--green-color)',
          '&:hover': { backgroundColor: 'var(--dark-gray-color)' },
          '&.Mui-disabled': {
            backgroundColor: 'rgba(27, 48, 34, 0.4)',
            color: 'var(--ligth-color)',
          },
        }}
      >
        {loading ? 'Entrando...' : 'Entrar'}
      </Button>
    </Box>
  );
}
