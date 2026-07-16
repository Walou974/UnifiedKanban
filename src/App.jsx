import React, { useState, useEffect } from 'react';
import { 
  DndContext, 
  useDraggable, 
  useDroppable, 
  PointerSensor, 
  useSensor, 
  useSensors,
  DragOverlay
} from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import { restrictToWindowEdges } from '@dnd-kit/modifiers';
import styles from './App.module.css';

const initialBoardData = {
  columns: [
    { id: 'col-todo', title: 'À faire' },
    { id: 'col-progress', title: 'En cours' },
    { id: 'col-done', title: 'Terminé' }
  ],
  cards: [
    { id: 'card-1', columnId: 'col-todo', title: 'Exemple de tâche' }
  ]
};

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

// --- COMPOSANT COLONNE (Droppable) ---
function Column({ col, cards, onAddCard, onDeleteCard, onDeleteCol, onRenameCol }) {
  const { setNodeRef, isOver } = useDroppable({
    id: col.id,
  });

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
      <button onClick={() => onAddCard(col.id)} className={styles.addCardBtn}>
        + Ajouter une tâche
      </button>
    </div>
  );
}

// --- COMPOSANT PRINCIPAL (App) ---
export default function App() {
  const [columns, setColumns] = useState([]);
  const [cards, setCards] = useState([]);
  const [activeCardId, setActiveCardId] = useState(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  // Charger les données
  useEffect(() => {
    const savedData = localStorage.getItem('unified-kanban-data');
    if (savedData) {
      const parsed = JSON.parse(savedData);
      setColumns(parsed.columns || []);
      setCards(parsed.cards || []);
    } else {
      setColumns(initialBoardData.columns);
      setCards(initialBoardData.cards);
    }
  }, []);

  // Sauvegarder automatiquement
  useEffect(() => {
    if (columns.length > 0) {
      localStorage.setItem(
        'unified-kanban-data',
        JSON.stringify({ columns, cards })
      );
    }
  }, [columns, cards]);

  const addColumn = () => {
    const newId = `col-${Date.now()}`;
    setColumns([...columns, { id: newId, title: 'Nouvelle Colonne' }]);
  };

  const renameColumn = (colId, newTitle) => {
    setColumns(columns.map(col => col.id === colId ? { ...col, title: newTitle } : col));
  };

  const deleteColumn = (colId) => {
    if (confirm("Supprimer cette colonne et toutes ses tâches ?")) {
      setColumns(columns.filter(col => col.id !== colId));
      setCards(cards.filter(card => card.columnId !== colId));
    }
  };

  const addCard = (colId) => {
    const title = prompt("Nom de la tâche :");
    if (!title || title.trim() === "") return;
    setCards([...cards, { id: `card-${Date.now()}`, columnId: colId, title: title.trim() }]);
  };

  const deleteCard = (cardId) => {
    setCards(cards.filter(card => card.id !== cardId));
  };

  const handleDragStart = (event) => {
    setActiveCardId(event.active.id);
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;
    setActiveCardId(null);

    if (!over) return;

    const cardId = active.id;
    const targetColumnId = over.id;

    setCards(prevCards => prevCards.map(card => 
      card.id === cardId ? { ...card, columnId: targetColumnId } : card
    ));
  };

  const activeCard = cards.find(c => c.id === activeCardId);

  return (
    <div className={styles.appContainer}>
      <header className={styles.header}>
        <h1 className={styles.appTitle}>📋 Unified Kanban</h1>
        <button onClick={addColumn} className={styles.addColumnBtn}>
          + Ajouter une colonne
        </button>
      </header>

      <DndContext 
        sensors={sensors} 
        onDragStart={handleDragStart} 
        onDragEnd={handleDragEnd}
      >
        <main className={styles.boardContainer}>
          {columns.map(col => {
            const colCards = cards.filter(card => card.columnId === col.id);
            return (
              <Column 
                key={col.id} 
                col={col} 
                cards={colCards} 
                onAddCard={addCard} 
                onDeleteCard={deleteCard}
                onDeleteCol={deleteColumn}
                onRenameCol={renameColumn}
              />
            );
          })}
        </main>

        <DragOverlay modifiers={[restrictToWindowEdges]}>
          {activeCard ? (
            <CardView card={activeCard} isDragging={true} />
          ) : null}
        </DragOverlay>
      </DndContext>
    </div>
  );
}