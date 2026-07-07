import { useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';

export default function RegisterForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [register, setRegister] = useState({
    username: '',
    firstName: '',
    lastName: '',
    birthYear: '',
    genre: '',
    mail: '',
    password: '',
  });

  const handleChange = (field) => (event) => {
    setRegister((prev) => ({ ...prev, [field]: event.target.value }));
  };

  const toggleShowPassword = () => {
    setShowPassword((prev) => !prev);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const fullName = `${register.firstName} ${register.lastName}`.trim();
    console.log('Register:', { ...register, name: fullName });
    // TODO: llamar al servicio de registro
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <Typography variant="h6" sx={{ color: 'var(--dark-gray-color)' }}>
        Crear cuenta
      </Typography>
//TODO: Agregar validaciones usuername disponible y mensajes de error
      <TextField
        label="Nombre de usuario"
        value={register.username}
        onChange={handleChange('username')}
        fullWidth
        required
      />
//Agregar validaciones de nombre y apellido, que no sean numeros, que no esten vacios, que no tengan caracteres especiales
      <Box sx={{ display: 'flex', gap: 2 }}>
        <TextField
          label="Nombre"
          value={register.firstName}
          onChange={handleChange('firstName')}
          fullWidth
          required
        />
        <TextField
          label="Apellido"
          value={register.lastName}
          onChange={handleChange('lastName')}
          fullWidth
          required
        />
      </Box>
// Agregar validaciones de año de nacimiento, que sea un numero, que no sea mayor al año actual, que no sea menor a 10 años, que no este vacio
      <Box sx={{ display: 'flex', gap: 2 }}>
        <TextField
          label="Año de nacimiento"
          type="number"
          value={register.birthYear}
          onChange={handleChange('birthYear')}
          fullWidth
          required
          inputProps={{ min: 1900, max: new Date().getFullYear() }}
        />
// Agregar validaciones de genero, que sea uno de los valores del select, que no este vacio
        <FormControl fullWidth required>
          <InputLabel id="genre-label">Género</InputLabel>
          <Select
            labelId="genre-label"
            value={register.genre}
            label="Género"
            onChange={handleChange('genre')}
          >
            <MenuItem value="femenino">Femenino</MenuItem>
            <MenuItem value="masculino">Masculino</MenuItem>
            <MenuItem value="no_binario">No binario</MenuItem>
            <MenuItem value="otro">Otro</MenuItem>
          </Select>
        </FormControl>
      </Box>
//validaciones de correo, que sea un correo valido, que no este vacio
//TODO: LT agregar flujo de confirmacion de correo, que se envie un correo con un link de confirmacion, que el usuario tenga que hacer click en el link para activar su cuenta
      <TextField
        label="Correo electrónico"
        type="email"
        value={register.mail}
        onChange={handleChange('mail')}
        fullWidth
        required
      />
//validaciones de contraseña, que tenga al menos 8 caracteres, que tenga al menos una letra mayuscula, que tenga al menos un numero, que tenga al menos un caracter especial, que no este vacia
      <TextField
        label="Contraseña"
        type={showPassword ? 'text' : 'password'}
        value={register.password}
        onChange={handleChange('password')}
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
// Desactivar si es que no se cumplen las validaciones o si alguno de los campos esta vacio
      <Button
        type="submit"
        variant="contained"
        size="large"
        fullWidth
        sx={{
          backgroundColor: 'var(--green-color)',
          '&:hover': { backgroundColor: 'var(--dark-gray-color)' },
        }}
      >
        Registrarse
      </Button>
    </Box>
  );
}
