import { useEffect, useRef, useState } from 'react';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import Chip from '@mui/material/Chip';
import { Button } from '@mui/material';
import BasicModal from '../../../components/modal.jsx';

export default function IngredientsSection({
    ingredients,
    ingredientOptions,
    ingredientInput,
    setIngredientInput,
    cantidadInput,
    setCantidadInput,
    medidaInput,
    setMedidaInput,
    medidaOptions,
    fieldErrors,
    onAddIngredient,
    onDeleteIngredient,
}) {
    const ingredientsContainerRef = useRef(null);
    const [showOverflowChip, setShowOverflowChip] = useState(false);
    const [openModal, setOpenModal] = useState(false);
    const addIngredientStyle = {
        display: 'flex',
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: '8px',
        marginBottom: '8px',
    };
    const modalStyle = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 400,
        bgcolor: 'background.paper',
        border: '2px solid #000',
        boxShadow: 24,
        p: 4,
        };
    const modalContent = {
        title: 'Ingredientes',
        body: 'ingredientes list'
    };

    const showOtherIngredients = () => {
        setOpenModal(true);
        //TODO: feat - show all ingredients in a modal
        //TODO: fix - chip view is cutting ingredient names, maybe show them in a tooltip on hover or something like that
    }

    useEffect(() => {
        const container = ingredientsContainerRef.current;

        if (!container) {
            setShowOverflowChip(false);
            return;
        }

        const checkOverflow = () => {
            const hasOverflow = container.scrollHeight > container.clientHeight;
            setShowOverflowChip(hasOverflow);
        };

        checkOverflow();

        let observer;
        if (typeof ResizeObserver !== 'undefined') {
            observer = new ResizeObserver(checkOverflow);
            observer.observe(container);
        }

        window.addEventListener('resize', checkOverflow);

        return () => {
            window.removeEventListener('resize', checkOverflow);
            if (observer) {
                observer.disconnect();
            }
        };
    }, [ingredients]);

    return (
        <>

        <BasicModal
            isOpen={openModal}
            onClose={() => setOpenModal(false)}
            modalStyle={modalStyle}
            content={modalContent}
        ></BasicModal>
            <h3>Ingredientes:</h3>
            <div style={{ display: 'flex', flexDirection: 'row'  }}>
                <div
                ref={ingredientsContainerRef}
                style={{
                    display: ingredients.length > 0 ? 'flex' : 'none',
                    maxHeight: '38px',
                    maxWidth: '90vw',
                    textOverflow: 'ellipsis',
                    overflow: 'hidden',
                }}
            >
                {ingredients.map((ing, idx) => (
                    <Chip
                        key={idx}
                        label={`${ing.cantidad} ${ing.medida} ${ing.ingrediente}`}
                        onDelete={() => onDeleteIngredient(idx)}
                        style={{ margin: 4 }}
                       
                    />
                ))}
            </div>
            {showOverflowChip && ingredients.length > 0 ? (
                <span style={{ display: 'flex', alignItems: 'center', paddingLeft: 8 }}>
                    <Chip label={`${ingredients.length} +`} style={{ margin: 4 }}  onClick={() => showOtherIngredients()}/>
                </span>
            ) : null}
            </div>
            

            <div style={addIngredientStyle}>
                <Autocomplete
                    freeSolo
                    options={ingredientOptions}
                    inputValue={ingredientInput}
                    onChange={(_, newValue) => setIngredientInput(typeof newValue === 'string' ? newValue : '')}
                    onInputChange={(_, newInputValue, reason) => {
                        if (reason === 'reset') return;
                        setIngredientInput(newInputValue || '');
                    }}
                    clearOnBlur={false}
                    sx={{ width: '50%', minWidth: 200 }}
                    renderInput={(params) => (
                        <TextField
                            {...params}
                            label="Ingrediente"
                            size="small"
                            type="text"
                            error={fieldErrors.ingredients}
                            helperText={fieldErrors.ingredients ? 'Agrega al menos un ingrediente' : ''}
                        />
                    )}
                />
                <TextField
                    label="Cantidad"
                    value={cantidadInput}
                    onChange={(e) => {
                        const val = e.target.value;
                        if (val === '') {
                            setCantidadInput('');
                            return;
                        }

                        const numericValue = Number(val);
                        if (!Number.isNaN(numericValue) && numericValue >= 0) {
                            setCantidadInput(val);
                        }
                    }}
                    type="number"
                    size="small"
                    style={{ width: 100,  }}
                    error={fieldErrors.cantidad}
                    helperText={fieldErrors.cantidad ? 'Agrega cantidad' : ''}
                    inputProps={{ min: 1 }}
                />
                <Autocomplete
                    disablePortal
                    options={medidaOptions}
                    value={medidaInput}
                    style={{ width: 100 }}
                    onChange={(_, newValue) => setMedidaInput(newValue || '')}
                    sx={{ width: 220 }}
                    renderInput={(params) => (
                        <TextField
                            {...params}
                            label="Medida"
                            size="small"
                            error={fieldErrors.medida}
                            helperText={fieldErrors.medida ? 'Agrega medida' : ''}
                        />
                    )}
                />
            </div>

            <Button size="small" sx={{ width: 100 }} variant="outlined" onClick={onAddIngredient}>
                Agregar
            </Button>
        </>
    );
}
