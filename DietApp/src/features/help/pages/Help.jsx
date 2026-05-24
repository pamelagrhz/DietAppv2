import { useEffect, useState } from 'react';
import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import TextField from '@mui/material/TextField';
import helpContent from '../data/Help-es.json';
import { getProfileByUsername } from '../../profile/services/profile.service.js';
import './Help.css';

const PROFILE_USERNAME = 'pamelagrhz';

export default function Help() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [username, setUsername] = useState(PROFILE_USERNAME);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [submitError, setSubmitError] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const user = await getProfileByUsername(PROFILE_USERNAME);
        setUsername(user?.username || PROFILE_USERNAME);
        setName(user?.name || '');
        setEmail(user?.mail || '');
      } catch {
        setUsername(PROFILE_USERNAME);
      }
    };

    loadProfile();
  }, []);

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setMessage('');
    setSubmitError('');
  };

  const handleSubmitSupport = () => {
    if (!message.trim()) {
      setSubmitError('Escribe tu duda antes de enviar.');
      return;
    }

    setSubmitError('');
    setIsDialogOpen(false);
    setMessage('');
    setShowSuccess(true);
  };

  return (
    <main className="help-page">
      <header className="help-header">
        <p className="help-kicker">Manual de usuario</p>
        <h1 className="help-title">{helpContent.title}</h1>
        <p className="help-subtitle">{helpContent.subtitle}</p>
        <p className="help-intro">{helpContent.intro}</p>
      </header>

      <section className="help-accordion-list">
        {helpContent.sections.map((section) => (
          <Accordion key={section.title} className="help-accordion" disableGutters>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <span className="help-accordion-title">{section.title}</span>
            </AccordionSummary>
            <AccordionDetails>
              <div className="help-accordion-content">
                {section.content.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>
            </AccordionDetails>
          </Accordion>
        ))}
      </section>

      <section className="help-support-card">
        <div>
          <h2 className="help-support-title">{helpContent.support.title}</h2>
          <p className="help-support-description">{helpContent.support.description}</p>
        </div>
        <Button variant="contained" className="help-support-button" onClick={() => setIsDialogOpen(true)}>
          {helpContent.support.buttonLabel}
        </Button>
      </section>

      <Dialog open={isDialogOpen} onClose={handleCloseDialog} fullWidth maxWidth="sm">
        <DialogTitle>{helpContent.support.formTitle}</DialogTitle>
        <DialogContent>
          <div className="help-support-form">
            {submitError ? <Alert severity="error">{submitError}</Alert> : null}
            <TextField size="small" label="Usuario" value={username} slotProps={{ input: { readOnly: true } }} />
            <TextField size="small" label="Nombre" value={name} slotProps={{ input: { readOnly: true } }} />
            <TextField size="small" label="Correo" value={email} slotProps={{ input: { readOnly: true } }} />
            <TextField
              label={helpContent.support.messageLabel}
              placeholder={helpContent.support.messagePlaceholder}
              value={message}
              onChange={(event) => setMessage(event.target.value)}
              multiline
              minRows={5}
              fullWidth
            />
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>{helpContent.support.cancelLabel}</Button>
          <Button variant="contained" onClick={handleSubmitSupport}>
            {helpContent.support.submitLabel}
          </Button>
        </DialogActions>
      </Dialog>

      {showSuccess ? (
        <Alert className="help-success-alert" severity="success" onClose={() => setShowSuccess(false)}>
          {helpContent.support.successMessage}
        </Alert>
      ) : null}
    </main>
  );
}
