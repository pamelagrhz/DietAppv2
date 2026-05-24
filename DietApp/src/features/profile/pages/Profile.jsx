import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import InputAdornment from '@mui/material/InputAdornment';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Alert from '@mui/material/Alert';
import { getProfileByUsername, updateProfilePassword } from '../services/profile.service.js';
import './Profile.css';

const genderOptions = ['Femenino', 'Masculino', 'No binario', 'Otro'];
const PROFILE_USERNAME = 'pamelagrhz'; // TODO: Replace with dynamic username from auth context or similar mechanism

export default function Profile() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const [profilePhotoUrl, setProfilePhotoUrl] = useState('');
  const [username, setUsername] = useState(PROFILE_USERNAME);
  const [fullName, setFullName] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('Femenino');
  const [email, setEmail] = useState('');
  const [recipesCount, setRecipesCount] = useState(0);
  const [score, setScore] = useState(4.5);
  const [profileError, setProfileError] = useState('');

  const [isPasswordDialogOpen, setIsPasswordDialogOpen] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState('');

  const handleOpenFilePicker = () => {
    fileInputRef.current?.click();
  };

  const handlePhotoChange = (event) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    const objectUrl = URL.createObjectURL(file);
    setProfilePhotoUrl(objectUrl);
  };

  const handleAgeChange = (event) => {
    const onlyDigits = event.target.value.replace(/\D/g, '');
    setAge(onlyDigits);
  };

  useEffect(() => {
    const loadProfile = async () => {
      try {
        setProfileError('');
        const user = await getProfileByUsername(PROFILE_USERNAME);
        setUsername(user.username || PROFILE_USERNAME);
        setFullName(user.name || '');
        setAge(String(user.age ?? ''));
        setGender(user.genre || 'Femenino');
        setEmail(user.mail || '');
        setRecipesCount(Array.isArray(user.recipes) ? user.recipes.length : 0);
        setScore(typeof user.score === 'number' ? user.score : 4.5);
      } catch (error) {
        setProfileError(error.message || 'No se pudo cargar el perfil.');
      }
    };

    loadProfile();
  }, []);

  const resetPasswordDialog = () => {
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setShowCurrentPassword(false);
    setShowNewPassword(false);
    setShowConfirmPassword(false);
    setPasswordError('');
  };

  const handleOpenPasswordDialog = () => {
    setPasswordSuccess('');
    setPasswordError('');
    setIsPasswordDialogOpen(true);
  };

  const handleClosePasswordDialog = () => {
    setIsPasswordDialogOpen(false);
    resetPasswordDialog();
  };

  const handleChangePassword = async () => {
    try {
      setPasswordError('');
      setPasswordSuccess('');

      if (!currentPassword || !newPassword || !confirmPassword) {
        setPasswordError('Debes completar los 3 campos de password.');
        return;
      }

      await updateProfilePassword({
        username,
        currentPassword,
        newPassword,
        confirmPassword,
      });

      setPasswordSuccess('Password actualizado correctamente.');
      handleClosePasswordDialog();
    } catch (error) {
      setPasswordError(error.message || 'No se pudo actualizar el password.');
    }
  };

  return (
    <div className="profile-page">
      <h1 className="profile-title">Mi Perfil.</h1>

      <div className="profile-grid">
        <div className="profile-side">
          <section className="profile-photo-block">
            <div className="profile-photo-wrapper">
              {profilePhotoUrl ? (
                <img
                  className="profile-photo-placeholder"
                  src={profilePhotoUrl}
                  alt="Foto de perfil"
                />
              ) : (
                <AccountCircleIcon className="profile-photo-placeholder" />
              )}
              <IconButton
                className="profile-photo-edit"
                size="small"
                aria-label="cambiar foto de perfil"
                onClick={handleOpenFilePicker}
              >
                <PhotoCameraIcon fontSize="small" />
              </IconButton>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              style={{ display: 'none' }}
              onChange={handlePhotoChange}
            />
          </section>

          <section className="profile-card">
            <h2 className="profile-stats-title">Estadisticas</h2>
            <div className="profile-stats-row">
              <span>Recetas:</span>
              <strong>{recipesCount}</strong>
            </div>
            <div className="profile-stats-row">
              <span>Puntuacion:</span>
              <strong>{score}</strong>
            </div>
            <Button
              variant="outlined"
              fullWidth
              className="profile-recipes-button"
              onClick={() => navigate('/my-recipes')}
            >
              Ver mis recetas
            </Button>
          </section>
        </div>

        <section className="profile-form-block">
          {profileError && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {profileError}
            </Alert>
          )}
          {passwordSuccess && (
            <Alert severity="success" sx={{ mb: 2 }}>
              {passwordSuccess}
            </Alert>
          )}
          <div className="profile-fields">
            <TextField
              size="small"
              label="Username"
              value={username}
              slotProps={{ input: { readOnly: true } }}
            />
            <TextField
              size="small"
              label="Nombre"
              value={fullName}
              onChange={(event) => setFullName(event.target.value)}
            />
            <TextField
              size="small"
              label="Edad"
              value={age}
              onChange={handleAgeChange}
              slotProps={{
                input: {
                  endAdornment: <InputAdornment position="end">años</InputAdornment>,
                },
                htmlInput: { inputMode: 'numeric', pattern: '[0-9]*' },
              }}
            />
            <TextField
              size="small"
              select
              label="Genero"
              value={gender}
              onChange={(event) => setGender(event.target.value)}
            >
              {genderOptions.map((option) => (
                <MenuItem key={option} value={option}>
                  {option}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              size="small"
              label="Correo"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
            />
            <TextField
              size="small"
              label="Password"
              type="password"
              value="********"
              slotProps={{ input: { readOnly: true } }}
            />
            <Button
              variant="outlined"
              className="profile-password-button"
              onClick={handleOpenPasswordDialog}
            >
              Cambiar password
            </Button>
          </div>
        </section>
      </div>

      <Dialog
        open={isPasswordDialogOpen}
        onClose={handleClosePasswordDialog}
        fullWidth
        maxWidth="xs"
      >
        <DialogTitle>Cambiar password</DialogTitle>
        <DialogContent>
          {passwordError && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {passwordError}
            </Alert>
          )}
          <div className="profile-password-fields">
            <TextField
              size="small"
              label="Password actual"
              type={showCurrentPassword ? 'text' : 'password'}
              value={currentPassword}
              onChange={(event) => setCurrentPassword(event.target.value)}
              slotProps={{
                input: {
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        edge="end"
                        onClick={() => setShowCurrentPassword((prev) => !prev)}
                        aria-label="mostrar u ocultar password actual"
                      >
                        {showCurrentPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                      </IconButton>
                    </InputAdornment>
                  ),
                },
              }}
            />
            <TextField
              size="small"
              label="Nuevo password"
              type={showNewPassword ? 'text' : 'password'}
              value={newPassword}
              onChange={(event) => setNewPassword(event.target.value)}
              slotProps={{
                input: {
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        edge="end"
                        onClick={() => setShowNewPassword((prev) => !prev)}
                        aria-label="mostrar u ocultar nuevo password"
                      >
                        {showNewPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                      </IconButton>
                    </InputAdornment>
                  ),
                },
              }}
            />
            <TextField
              size="small"
              label="Confirmar nuevo password"
              type={showConfirmPassword ? 'text' : 'password'}
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)}
              slotProps={{
                input: {
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        edge="end"
                        onClick={() => setShowConfirmPassword((prev) => !prev)}
                        aria-label="mostrar u ocultar confirmacion de password"
                      >
                        {showConfirmPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                      </IconButton>
                    </InputAdornment>
                  ),
                },
              }}
            />
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClosePasswordDialog}>Cancelar</Button>
          <Button variant="contained" onClick={handleChangePassword}>
            Guardar password
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
