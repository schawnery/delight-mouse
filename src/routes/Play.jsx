//load constants and depdendencies
import React, { useState, useEffect, useCallback } from 'react';
// import { useNavigate } from 'react-router-dom';

// load components
import WeeklyProgressBar from '../components/WeeklyProgressBar/WeeklyProgressBar';
// import ScoreBox from '../components/ScoreBox/ScoreBox';
import TextBox from '../components/TextBox/TextBox';
import Column from '../components/Kanban/Column/Column';
import Board from '../components/Kanban/Board/Board';
import '../styles/Home.css';

import DragCard from '../components/Card/DragCard/DragCard';
import { getAllColumns, getAllCards, putColumn } from '../utils/kanbanDb';



/**
 * Play - Main Kanban board route for daily challenges and tasks.
 * Features:
 *   - Card creation, editing, drag-and-drop between columns
 *   - LocalStorage persistence
 *   - Challenge prompt generation
 *   - Character limits and counters
 */
const defaultColumns = {
  'column-1': { id: 'column-1', title: 'Test Column', cardIds: ['card-1'] },
  'column-2': { id: 'column-2', title: 'Test Column 2', cardIds: ['card-2'] },
  'column-3': { id: 'column-3', title: 'Test Column 3', cardIds: ['card-3'] }
};
const defaultCards = {
  'card-1': { id: 'card-1', title: 'Test Card', description: 'This is a test card in the new column.', value: 1 },
  'card-2': { id: 'card-2', title: 'Test Card', description: 'This is a test card in the new column.', value: 2 },
  'card-3': { id: 'card-3', title: 'Test Card', description: 'This is a test card in the new column.', value: 3 }
};


const Play = () => {
  const [columns, setColumns] = useState({});
  const [cards, setCards] = useState({});

  // Load from IndexedDB on mount, or set defaults if empty
  useEffect(() => {
    async function loadFromDb() {
      const dbColumns = await getAllColumns();
      const dbCards = await getAllCards();
      if (dbColumns.length > 0 && dbCards.length > 0) {
        // Convert arrays to objects keyed by id, ensure cardIds is always an array
        const columnsObj = {};
        dbColumns.forEach(col => {
          columnsObj[col.id] = {
            ...col,
            cardIds: Array.isArray(col.cardIds) ? col.cardIds : [],
          };
        });
        const cardsObj = {};
        dbCards.forEach(card => { cardsObj[card.id] = card; });
        setColumns(columnsObj);
        setCards(cardsObj);
      } else {
        // If IndexedDB is empty, set defaults and persist them
        setColumns(defaultColumns);
        setCards(defaultCards);
        Object.values(defaultColumns).forEach(col => putColumn(col));
        // You may want to persist defaultCards as well if you add putCard
      }
    }
    loadFromDb();
  }, []);

  // Persist columns to IndexedDB whenever columns state changes
  useEffect(() => {
    Object.values(columns).forEach(col => {
      putColumn(col);
    });
  }, [columns]);

  return (
    <div className="home-container">
      <WeeklyProgressBar />
      <Board columns={columns} setColumns={setColumns}>
        {Object.values(columns).map((column) => (
          <Column
            key={column.id}
            header={column.title}
            columnId={column.id}
            cardIds={column.cardIds}
          >
            {column.cardIds.map((cardId) => {
              const card = cards[cardId];
              return card ? (
                <DragCard
                  key={card.id}
                  id={card.id}
                  title={card.title}
                  description={card.description}
                  value={card.value}
                />
              ) : null;
            })}
          </Column>
        ))}
      </Board>
    </div>
  );
};

export default Play;