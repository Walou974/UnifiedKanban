import React, { useState, useEffect } from 'react';

import CardView from './components/CardView';
import DraggableCard from './components/DraggableCard';
import Column from './components/Column';
import styles from './App.module.css';

import { DndContext, PointerSensor, useSensor, useSensors, DragOverlay } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import { restrictToWindowEdges } from '@dnd-kit/modifiers';


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

    setColumns(columns.filter(col => col.id !== colId));
    setCards(cards.filter(card => card.columnId !== colId));

  };

  const addCard = (colId, title) => {
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
        <img src="/icons/icon1254.png" alt="logo"/>
        <h1 className={styles.appTitle}> Unified Kanban</h1>
        <button onClick={addColumn} className={styles.addColumnBtn}>
          + Ajouter une colonne
        </button>
      </header>

      <DndContext
        sensors={sensors}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <main
          className={styles.boardContainer}
          style={{
            '--column-height': columns.length <= 3 ? '420px' : '180px'
          }}
        >
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