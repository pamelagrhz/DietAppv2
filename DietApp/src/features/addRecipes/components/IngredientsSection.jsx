import { useEffect, useRef, useState } from 'react';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import Chip from '@mui/material/Chip';
import { Button } from '@mui/material';
import BasicModal from '../../../components/modal.jsx';
import EditIngredient from '../../editRecipe/editIngredient.jsx';

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
    const [visibleChipsCount, setVisibleChipsCount] = useState(0);
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
        width: 500,
        bgcolor: 'background.paper',
        boxShadow: 24,
        p: 4,
    };
    const modalContent = {
        title: 'Ingredientes',
        body: <EditIngredient ingredients={ingredients} onDeleteIngredient={onDeleteIngredient} />,
    };
    useEffect(() => {
        const container = ingredientsContainerRef.current;

        if (!container) {
            setVisibleChipsCount(ingredients.length);
            setShowOverflowChip(false);
            return;
        }

        const calculateVisibleChips = () => {
            const availableWidth = container.clientWidth;

            if (!availableWidth || ingredients.length === 0) {
                setVisibleChipsCount(ingredients.length);
                setShowOverflowChip(false);
                return;
            }

            const canvas = document.createElement('canvas');
            const context = canvas.getContext('2d');
            if (context) {
                context.font = '400 13px Roboto, Helvetica, Arial, sans-serif';
            }

            // Keep this in sync with Chip maxWidth: { xs: '56vw', sm: '32vw', md: '24vw' }
            const viewportWidth = window.innerWidth;
            const maxChipWidth = viewportWidth < 600
                ? viewportWidth * 0.56
                : viewportWidth < 900
                    ? viewportWidth * 0.32
                    : viewportWidth * 0.24;

            let usedWidth = 0;
            let count = 0;

            for (const ing of ingredients) {
                const label = `${ing.cantidad} ${ing.medida} ${ing.ingrediente}`;
                const textWidth = context ? context.measureText(label).width : label.length * 7;
                // Approximate total chip width: content + paddings/icons, clamped by responsive maxWidth.
                const naturalChipWidth = Math.ceil(textWidth) + 64;
                const chipWidth = Math.min(naturalChipWidth, maxChipWidth) + 8;

                if (usedWidth + chipWidth > availableWidth) {
                    break;
                }

                usedWidth += chipWidth;
                count += 1;
            }

            if (ingredients.length > 0 && count === 0) {
                count = 1;
            }

            setVisibleChipsCount(count);
            setShowOverflowChip(count < ingredients.length);
        };

        calculateVisibleChips();

        let observer;
        if (typeof ResizeObserver !== 'undefined') {
            observer = new ResizeObserver(calculateVisibleChips);
            observer.observe(container);
        }

        window.addEventListener('resize', calculateVisibleChips);

        return () => {
            window.removeEventListener('resize', calculateVisibleChips);
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
                    width: '90vw',
                    maxHeight: '38px',
                    maxWidth: '90vw',
                    overflow: 'hidden',
                    flexWrap: 'nowrap',
                }}
            >
                {ingredients.slice(0, visibleChipsCount).map((ing, idx) => (
                    <Chip
                        key={idx}
                        label={`${ing.cantidad} ${ing.medida} ${ing.ingrediente}`}
                        onDelete={() => onDeleteIngredient(idx)}
                        sx={{
                            m: 0.5,
                            maxWidth: { xs: '56vw', sm: '32vw', md: '24vw' },
                            minWidth: 0,
                            flexShrink: 1,
                            '& .MuiChip-label': {
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                whiteSpace: 'nowrap',
                                display: 'block',
                            },
                        }}
                       
                    />
                ))}
            </div>
            {showOverflowChip && ingredients.length > 0 ? (
                <span style={{ display: 'flex', alignItems: 'center', paddingLeft: 8 }}>
                    <Chip
                        label={`+${ingredients.length - visibleChipsCount}`}
                        style={{ margin: 0 }}
                        onClick={() => setOpenModal(true)}
                    />
                </span>
            ) : null}
            </div>
            

{/* TODO: Create a component for adding ingredients */}
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
