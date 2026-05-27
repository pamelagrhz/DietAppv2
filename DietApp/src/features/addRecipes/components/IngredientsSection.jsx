import { useEffect, useRef, useState } from 'react';
import Chip from '@mui/material/Chip';
import { Button, IconButton, Tooltip } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import BasicModal from '../../../components/modal.jsx';
import EditIngredient from '../../editRecipe/editIngredient.jsx';
import AddIngredientInputs from './AddIngredientInputs.jsx';

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
    onUpdateIngredient,
}) {
    const ingredientsContainerRef = useRef(null);
    const [showOverflowChip, setShowOverflowChip] = useState(false);
    const [visibleChipsCount, setVisibleChipsCount] = useState(0);
    const [openModal, setOpenModal] = useState(false);
    const modalStyle = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 'min(92vw, 820px)',
        maxHeight: '82vh',
        bgcolor: 'background.paper',
        boxShadow: 24,
        p: 4,
        borderRadius: 2,
        overflowY: 'auto',
    };
    const modalContent = {
        title: 'Ingredientes',
        body: (
            <EditIngredient
                ingredients={ingredients}
                ingredientOptions={ingredientOptions}
                medidaOptions={medidaOptions}
                onDeleteIngredient={onDeleteIngredient}
                onUpdateIngredient={onUpdateIngredient}
            />
        ),
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
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px', marginBottom: 8 }}>
                <h3 style={{ margin: 0, fontSize: '1.75rem', color: '#1e4033', fontFamily: 'Bitter, Cambria, Georgia, serif' }}>Ingredientes</h3>
                <Tooltip title="Editar ingredientes">
                    <IconButton
                        size="small"
                        aria-label="editar ingredientes"
                        onClick={() => setOpenModal(true)}
                    >
                        <EditIcon fontSize="small" />
                    </IconButton>
                </Tooltip>
            </div>
            <div style={{ display: 'flex', flexDirection: 'row', marginBottom: 6 }}>
                <div
                ref={ingredientsContainerRef}
                style={{
                    display: ingredients.length > 0 ? 'flex' : 'none',
                    width: '100%',
                    maxHeight: '38px',
                    maxWidth: '100%',
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
                            maxWidth: { xs: '62vw', sm: '28vw', md: '17vw' },
                            minWidth: 0,
                            flexShrink: 1,
                            bgcolor: '#2f7c58',
                            color: '#f4f8f5',
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
            <AddIngredientInputs
                ingredientOptions={ingredientOptions}
                ingredientInput={ingredientInput}
                setIngredientInput={setIngredientInput}
                cantidadInput={cantidadInput}
                setCantidadInput={setCantidadInput}
                medidaInput={medidaInput}
                setMedidaInput={setMedidaInput}
                medidaOptions={medidaOptions}
                fieldErrors={fieldErrors}
            />
            <Button size="small" sx={{ width: 130, alignSelf: 'flex-start' }} variant="outlined" onClick={onAddIngredient}>
                Agregar
            </Button>
        </>
    );
}
