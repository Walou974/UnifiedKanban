import styles from '../App.module.css';
import CardView from './CardView';

import { useDraggable } from '@dnd-kit/core';

import { CSS } from '@dnd-kit/utilities';

// --- COMPOSANT CARTE ACTIVE (Draggable) ---
function DraggableCard({ card, onDelete }) {
    const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
        id: card.id,
    });

    const style = {
        transform: CSS.Translate.toString(transform),
        opacity: isDragging ? 0.4 : 1, // Effet fantôme à son emplacement d'origine
    };

    return (
        <div ref={setNodeRef} style={style}>
            {/* 🟢 On passe bien la fonction onDelete à CardView ici */}
            <CardView
                card={card}
                onDelete={onDelete}
                listeners={listeners}
                attributes={attributes}
                isDragging={isDragging}
            />
        </div>
    );
}

export default DraggableCard;