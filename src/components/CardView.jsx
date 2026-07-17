import styles from '../App.module.css';

// --- COMPOSANT CARTE RE-UTILISABLE (Visuel pur) ---
function CardView({ card, onDelete, isDragging, listeners, attributes, style }) {
    return (
        <div
            style={style}
            {...listeners}
            {...attributes}
            className={`${styles.card} ${isDragging ? styles.isDragging : ''}`}
        >
            <span className={styles.cardTitle}>{card.title}</span>
            {onDelete && (
                <button
                    draggable={false}
                    onClick={(e) => {
                        e.stopPropagation(); // Évite de déclencher le drag lors du clic
                        onDelete(card.id);
                    }}
                    className={styles.deleteCardBtn}
                >
                    ✕
                </button>
            )}
        </div>
    );
}

export default CardView;