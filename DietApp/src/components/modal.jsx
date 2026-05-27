import * as React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';


export default function BasicModal({ isOpen, onClose, modalStyle, content: { title, body } }) {

  return (
       <Modal
       
        open={Boolean(isOpen)}
        onClose={onClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={modalStyle} style={modalStyle}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            {title}
          </Typography>
          <Box id="modal-modal-description" sx={{ mt: 2 }}>
            {body}
          </Box>
        </Box>
      </Modal>
  );
}