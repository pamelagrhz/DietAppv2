import { useState, useMemo } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Alert from '@mui/material/Alert';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import PasswordField from '../common/PasswordField.jsx';
import { isValidEmail, isValidName, validatePassword, passwordRequirements } from '../../../../utils/validation.js';

export default function RegisterForm() {
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

  const passwordValidation = useMemo(
    () => validatePassword(register.password),
    [register.password]
  );

  const emailError = register.mail.trim().length > 0 && !isValidEmail(register.mail);
  const firstNameError = register.firstName.trim().length > 0 && !isValidName(register.firstName);
  const lastNameError = register.lastName.trim().length > 0 && !isValidName(register.lastName);

  const currentYear = new Date().getFullYear();
  const birthYearNum = Number(register.birthYear);
  const birthYearError =
    register.birthYear !== '' &&
    (Number.isNaN(birthYearNum) || birthYearNum < 1900 || birthYearNum > currentYear);

  const isFormValid = useMemo(() => {
    const trimmedUsername = register.username.trim();
    const trimmedMail = register.mail.trim();

    return (
      trimmedUsername.length > 0 &&
      isValidName(register.firstName) &&
      isValidName(register.lastName) &&
      register.birthYear !== '' &&
      !birthYearError &&
      register.genre !== '' &&
      isValidEmail(trimmedMail) &&
      passwordValidation.isValid
    );
  }, [register, birthYearError, passwordValidation.isValid]);

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!isFormValid) return;

    const fullName = `${register.firstName} ${register.lastName}`.trim();
    console.log('Register:', { ...register, name: fullName });
    // TODO: llamar al servicio de registro
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <Typography variant="h6" sx={{ color: 'var(--dark-gray-color)' }}>
        Crear cuenta
      </Typography>
      {/* //TODO: validar el nombre de usuario  */}

      <TextField
        label="Nombre de usuario"
        value={register.username}
        onChange={handleChange('username')}
        fullWidth
        required
      />

      <Box sx={{ display: 'flex', gap: 2 }}>
        <TextField
          label="Nombre"
          value={register.firstName}
          onChange={handleChange('firstName')}
          fullWidth
          required
          error={firstNameError}
          helperText={firstNameError ? 'Solo letras, acentos y espacios' : ''}
        />
        <TextField
          label="Apellido"
          value={register.lastName}
          onChange={handleChange('lastName')}
          fullWidth
          required
          error={lastNameError}
          helperText={lastNameError ? 'Solo letras, acentos y espacios' : ''}
        />
      </Box>

      <Box sx={{ display: 'flex', gap: 2 }}>
        <TextField
          label="Año de nacimiento"
          type="number"
          value={register.birthYear}
          onChange={handleChange('birthYear')}
          fullWidth
          required
          error={birthYearError}
          helperText={birthYearError ? `Entre 1900 y ${currentYear}` : ''}
          inputProps={{ min: 1900, max: currentYear }}
        />

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

      <TextField
        label="Correo electrónico"
        type="email"
        value={register.mail}
        onChange={handleChange('mail')}
        fullWidth
        required
        error={emailError}
        helperText={emailError ? 'El correo no tiene un formato válido' : ''}
      />

      <PasswordField
        label="Contraseña"
        value={register.password}
        onChange={handleChange('password')}
      />

      {register.password.length > 0 && (
        <Alert severity={passwordValidation.isValid ? 'success' : 'info'} sx={{ padding: 0 }}>
          <List dense sx={{ padding: 0 }}>
            {passwordRequirements.map((req) => {
              const passed = passwordValidation.checks[req.key];
              return (
                <ListItem key={req.key} sx={{ paddingY: 0 }}>
                  <ListItemText
                    primary={req.label}
                    primaryTypographyProps={{
                      sx: {
                        color: passed ? 'success.main' : 'text.secondary',
                        textDecoration: passed ? 'line-through' : 'none',
                      },
                    }}
                  />
                </ListItem>
              );
            })}
          </List>
        </Alert>
      )}

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
        Registrarse
      </Button>
    </Box>
  );
}
