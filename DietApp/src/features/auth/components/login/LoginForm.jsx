import { useState, useMemo } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';

export default function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [loginUser, setLoginUser] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  const toggleShowPassword = () => {
    setShowPassword((prev) => !prev);
  };

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

      <TextField
        label="Contraseña"
        type={showPassword ? 'text' : 'password'}
        value={loginPassword}
        onChange={(e) => setLoginPassword(e.target.value)}
        fullWidth
        required
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton onClick={toggleShowPassword} edge="end" aria-label="toggle password visibility">
                {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
              </IconButton>
            </InputAdornment>
          ),
        }}
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
