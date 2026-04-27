import { Button, Modal, Box } from '@mui/material';
import CreateRecipe from '../features/addRecipes/CreateRecipe.jsx';
export default function AppHeader({ open, onOpen, onClose }) {
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
            <Modal
                open={open}
                onClose={onClose}
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