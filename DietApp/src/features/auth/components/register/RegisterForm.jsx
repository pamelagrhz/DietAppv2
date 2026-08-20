import { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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
import { checkUsername, register } from '../../../../services/auth.service.js';

export default function RegisterForm() {
  const navigate = useNavigate();
  const [registerData, setRegisterData] = useState({
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
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (field) => (event) => {
    setRegisterData((prev) => ({ ...prev, [field]: event.target.value }));
  };

  // Validate username availability when it changes
  useEffect(() => {
    const trimmedUsername = registerData.username.trim();
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
  }, [registerData.username]);

  // Validate password requirements whenever the password changes
  const passwordValidation = useMemo(
    () => validatePassword(registerData.password),
    [registerData.password]
  );

  // Validate other fields
  const emailError = registerData.mail.trim().length > 0 && !isValidEmail(registerData.mail);
  const firstNameError = registerData.firstName.trim().length > 0 && !isValidName(registerData.firstName);
  const lastNameError = registerData.lastName.trim().length > 0 && !isValidName(registerData.lastName);

  // Validate birth year to ensure it's a valid year between 1900 and the current year
  const currentYear = new Date().getFullYear();
  const birthYearNum = registerData.birthYear
    ? Number(registerData.birthYear.split('-')[0])
    : NaN;
  const birthYearError =
    registerData.birthYear !== '' &&
    (Number.isNaN(birthYearNum) || birthYearNum < 1900 || birthYearNum > currentYear);

  // Check if the entire form is valid based on all individual validations
  const isFormValid = useMemo(() => {
    const trimmedUsername = registerData.username.trim();
    const trimmedMail = registerData.mail.trim();

    return (
      isValidUsername(trimmedUsername) &&
      usernameAvailable === true &&
      !usernameChecking &&
      isValidName(registerData.firstName) &&
      isValidName(registerData.lastName) &&
      registerData.birthYear !== '' &&
      !birthYearError &&
      registerData.genre !== '' &&
      isValidEmail(trimmedMail) &&
      passwordValidation.isValid
    );
  }, [registerData, birthYearError, passwordValidation.isValid, usernameAvailable, usernameChecking]);

  // Send the form data to the backend when the form is submitted
  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!isFormValid || loading) return;

    setError('');
    setLoading(true);

    const fullName = `${registerData.firstName} ${registerData.lastName}`.trim();

    try {
      await register({
        username: registerData.username.trim(),
        name: fullName,
        birthYear: birthYearNum,
        genre: registerData.genre,
        mail: registerData.mail.trim(),
        password: registerData.password,
      });
      navigate('/');
    } catch (err) {
      setError(err.message || 'Error al registrarse');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <Typography variant="h6" sx={{ color: 'var(--dark-gray-color)' }}>
        Crear cuenta
      </Typography>

      {error && <Alert severity="error">{error}</Alert>}

      <TextField
        label="Nombre de usuario"
        value={registerData.username}
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
          value={registerData.firstName}
          onChange={handleChange('firstName')}
          fullWidth
          required
          error={firstNameError}
          helperText={firstNameError ? 'Solo letras, acentos y espacios' : ''}
        />
        <TextField
          label="Apellido"
          value={registerData.lastName}
          onChange={handleChange('lastName')}
          fullWidth
          required
          error={lastNameError}
          helperText={lastNameError ? 'Solo letras, acentos y espacios' : ''}
        />
      </Box>

      <Box sx={{ display: 'flex', gap: 2 }}>
        <TextField
          label="Fecha de nacimiento"
          type="date"
          value={registerData.birthYear}
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
            value={registerData.genre}
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
        value={registerData.mail}
        onChange={handleChange('mail')}
        fullWidth
        required
        error={emailError}
        helperText={emailError ? 'El correo no tiene un formato válido' : ''}
      />

      <PasswordField
        label="Contraseña"
        value={registerData.password}
        onChange={handleChange('password')}
      />

      {registerData.password.length > 0 && (
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
        {loading ? 'Registrando...' : 'Registrarse'}
      </Button>
    </Box>
  );
}
