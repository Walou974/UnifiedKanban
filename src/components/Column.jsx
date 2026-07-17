import React, { useState, useEffect } from 'react';
import styles from '../App.module.css';
import DraggableCard from './DraggableCard';

import { useDroppable } from '@dnd-kit/core';

// --- COMPOSANT COLONNE (Droppable) ---
function Column({ col, cards, onAddCard, onDeleteCard, onDeleteCol, onRenameCol }) {
    const { setNodeRef, isOver } = useDroppable({
        id: col.id,
    });
    const [showModal, setShowModal] = useState(false);
    const [columnTitle, setColumnTitle] = useState("");


    return (
        <div ref={setNodeRef} className={`${styles.column} ${isOver ? styles.draggingOver : ''}`}>
            <div className={styles.columnHeader}>
                <input
                    type="text"
                    value={col.title}
                    onChange={(e) => onRenameCol(col.id, e.target.value)}
                    className={styles.columnTitleInput}
                />
                {/* 🟢 Correction : onDeleteCol de la prop au lieu de deleteColumn globale */}
                <button onClick={() => onDeleteCol(col.id)} className={styles.deleteColBtn}>
                    ✕
                </button>
            </div>

            <div className={styles.cardsList}>
                {cards.map(card => (
                    <DraggableCard
                        key={card.id}
                        card={card}
                        onDelete={onDeleteCard}
                    />
                ))}
            </div>

            {/* 🟢 Correction : onAddCard de la prop au lieu de addCard globale */}

            {showModal ? (
                <div className="mt-2">
                    <input
                        type="text"
                        value={columnTitle}
                        onChange={(e) => setColumnTitle(e.target.value)}
                        className={styles.addCardInput}
                        placeholder="Titre de la colonne"
                        onKeyDown={(e) => {
                            if (e.key === "Enter") {
                                onAddCard(col.id, columnTitle);
                                setShowModal(false);
                                setColumnTitle("");
                            }
                        }}
                        autoFocus
                    />

                    < button
                        className={styles.addCardConfirmBtn}
                        onClick={() => {
                            onAddCard(col.id, columnTitle);
                            setShowModal(false);
                            setColumnTitle("");
                        }}
                    >Ajouter
                    </button>
                </div>
            ) : (
                <button
                    onClick={() => setShowModal(true)}
                    className={styles.addCardBtn}
                >
                    Ajouter une tâche
                </button>
            )
            }
        </div >
    );
}

export default Column;