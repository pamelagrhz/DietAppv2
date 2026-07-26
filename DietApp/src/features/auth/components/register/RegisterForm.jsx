import { useState, useMemo, useEffect } from 'react';
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
import { isValidEmail, isValidName, isValidUsername, validatePassword, passwordRequirements } from '../../../../utils/validation.js';
import { checkUsername } from '../../../../services/auth.service.js';

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
  const [usernameError, setUsernameError] = useState(false);
  const [usernameAvailable, setUsernameAvailable] = useState(null);
  const [usernameChecking, setUsernameChecking] = useState(false);

  const handleChange = (field) => (event) => {
    setRegister((prev) => ({ ...prev, [field]: event.target.value }));
  };
// Validate username availability when it changes
  useEffect(() => {
    const trimmedUsername = register.username.trim();
    const isValid = isValidUsername(trimmedUsername);
    setUsernameError(trimmedUsername.length > 0 && !isValid);
    setUsernameAvailable(null);

    if (!isValid) {
      setUsernameChecking(false);
      return;
    }

    setUsernameChecking(true);
    const timeoutId = setTimeout(async () => {
      try {
        const available = await checkUsername(trimmedUsername);
        setUsernameAvailable(available);
      } catch {
        setUsernameAvailable(false);
      } finally {
        setUsernameChecking(false);
      }
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [register.username]);
// Validate password requirements whenever the password changes
  const passwordValidation = useMemo(
    () => validatePassword(register.password),
    [register.password]
  );
// Validate other fields
  const emailError = register.mail.trim().length > 0 && !isValidEmail(register.mail);
  const firstNameError = register.firstName.trim().length > 0 && !isValidName(register.firstName);
  const lastNameError = register.lastName.trim().length > 0 && !isValidName(register.lastName);

  // Validate birth year to ensure it's a valid year between 1900 and the current year
  const currentYear = new Date().getFullYear();
  const birthYearNum = register.birthYear
    ? Number(register.birthYear.split('-')[0])
    : NaN;
  const birthYearError =
    register.birthYear !== '' &&
    (Number.isNaN(birthYearNum) || birthYearNum < 1900 || birthYearNum > currentYear);

    //check if the entire form is valid based on all individual validations
  const isFormValid = useMemo(() => {
    const trimmedUsername = register.username.trim();
    const trimmedMail = register.mail.trim();

    return (
      isValidUsername(trimmedUsername) &&
      usernameAvailable === true &&
      !usernameChecking &&
      isValidName(register.firstName) &&
      isValidName(register.lastName) &&
      register.birthYear !== '' &&
      !birthYearError &&
      register.genre !== '' &&
      isValidEmail(trimmedMail) &&
      passwordValidation.isValid
    );
  }, [register, birthYearError, passwordValidation.isValid, usernameAvailable, usernameChecking]);

  //Send the form data to the backend when the form is submitted
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
      <TextField
        label="Nombre de usuario"
        value={register.username}
        onChange={handleChange('username')}
        fullWidth
        required
        error={usernameError || usernameAvailable === false}
        helperText={
          usernameError
            ? 'Solo letras, números, guiones bajos y puntos. Mínimo 5 caracteres.'
            : usernameAvailable === false
              ? 'Nombre de usuario no disponible'
              : usernameAvailable === true && !usernameChecking
                ? 'Nombre de usuario disponible'
                : usernameChecking
                  ? 'Verificando disponibilidad...'
                  : ''
        }
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
{/* TODO: Fix view placeholder errors */}
      <Box sx={{ display: 'flex', gap: 2 }}>
        <TextField
          label="Fecha de nacimiento"
          type="date"
          value={register.birthYear}
          onChange={handleChange('birthYear')}
          fullWidth
          required
          error={birthYearError}
          helperText={birthYearError ? `Entre 1900 y ${currentYear}` : ''}
          inputProps={{ min: '1900-01-01', max: `${currentYear}-12-31` }}
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
//TODO: Implement the functionality to submit the form data to the backend when the user clicks the "Registrarse" button.
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
