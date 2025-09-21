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



/**
 * Play - Main Kanban board route for daily challenges and tasks.
 * Features:
 *   - Card creation, editing, drag-and-drop between columns
 *   - LocalStorage persistence
 *   - Challenge prompt generation
 *   - Character limits and counters
 */
const initialColumns = {
  'column-1': { id: 'column-1', title: 'Test Column', cardIds: ['card-1'] },
  'column-2': { id: 'column-2', title: 'Test Column 2', cardIds: ['card-2'] },
  'column-3': { id: 'column-3', title: 'Test Column 3', cardIds: ['card-3'] }
};
const initialCards = {
  'card-1': { id: 'card-1', title: 'Test Card', description: 'This is a test card in the new column.', value: 1 },
  'card-2': { id: 'card-2', title: 'Test Card', description: 'This is a test card in the new column.', value: 2 },
  'card-3': { id: 'card-3', title: 'Test Card', description: 'This is a test card in the new column.', value: 3 }
};

const Play = () => {
  const [columns, setColumns] = useState(initialColumns);
  const [cards, setCards] = useState(initialCards);

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