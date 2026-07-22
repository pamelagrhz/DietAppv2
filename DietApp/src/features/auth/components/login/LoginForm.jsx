import { useState, useMemo } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import PasswordField from '../common/PasswordField.jsx';

export default function LoginForm() {
  const [loginUser, setLoginUser] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  const isFormValid = useMemo(() => {
    return loginUser.trim().length > 0 && loginPassword.trim().length > 0;
  }, [loginUser, loginPassword]);

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!isFormValid) return;
    console.log('Login:', { loginUser, loginPassword });
    // TODO: llamar al servicio de autenticación
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <Typography variant="h6" sx={{ color: 'var(--dark-gray-color)' }}>
        Bienvenido de nuevo
      </Typography>

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
        disabled={!isFormValid}
        sx={{
          backgroundColor: 'var(--green-color)',
          '&:hover': { backgroundColor: 'var(--dark-gray-color)' },
          '&.Mui-disabled': {
            backgroundColor: 'rgba(27, 48, 34, 0.4)',
            color: 'var(--ligth-color)',
          },
        }}
      >
        Entrar
      </Button>
    </Box>
  );
}
