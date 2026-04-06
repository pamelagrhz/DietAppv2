import { Button, Modal, Box } from '@mui/material';
import { useState } from 'react';
import CreateRecipe from '../features/addRecipes/CreateRecipe.jsx';
export default function AppHeader() {
    let buttonText = "Crear receta"
    //Use state to control the open/close of the modal
    const [open, setOpen] = useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    const style = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 400,
        bgcolor: 'background.paper',
        color: 'black',
        boxShadow: 24,
        p: 4,
    };
    return (
        <>
            <Button variant="contained" onClick={handleOpen}>{buttonText}</Button>
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="parent-modal-title"
                aria-describedby="parent-modal-description"
            >
                <Box sx={{ ...style, width: 400 }}>
                    <h2 id="parent-modal-title">Crear una nueva receta</h2>
                    <CreateRecipe/>
                </Box>
            </Modal>        </>
    )
}