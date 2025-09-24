//load constants and depdendencies
import React, { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';

// load components
import WeeklyProgressBar from '../components/WeeklyProgressBar/WeeklyProgressBar';
import ScoreBox from '../components/ScoreBox/ScoreBox';
import TextBox from '../components/TextBox/TextBox';
import Column from '../components/Kanban/Column/Column';
import Tag from '../components/Tag/Tag';
import Board from '../components/Kanban/Board/Board';
import '../styles/Home.css';

import DragCard from '../components/Card/DragCard/DragCard';
import EditCardModal from '../components/Modal/EditCardModal';
import { useKanbanBoard } from '../hooks/useKanbanBoard';
import Button from '../components/Button/Button';
import Modal from '../components/Modal/Modal';
import CreateCardModal from '../components/Modal/CreateCardModal';
import Counter from '../components/kanban/Counter/Counter';


/**
 * Play - Main Kanban board route for daily challenges and tasks.
 * Features:
 *   - Card creation, editing, drag-and-drop between columns
 *   - LocalStorage persistence
 *   - Challenge prompt generation
 *   - Character limits and counters
 */

// Column/card limits
const QUEUED_LIMIT = 21;
const IN_PROGRESS_WIP = 3;

const defaultColumns = {
  'column-1': { id: 'Queued', title: 'Queued', cardIds: ['card-1'] },
  'column-2': { id: 'In Progress', title: 'In Progress', cardIds: ['card-2'] },
  'column-3': { id: 'Completed', title: 'Completed', cardIds: ['card-3'] }
};
const defaultCards = {
  'card-1': { id: 'card-1', title: 'Glyph-1 Tutorial', description: 'Gamify your life with a rogue-like kanban board', value: 1 },
  'card-2': { id: 'card-2', title: 'Create a weekly deck', description: 'Add up to 21 cards per week and work on 3 cards at a time', value: 2 },
  'card-3': { id: 'card-3', title: 'Speed + Chained completes', description: 'The more you complete together, the more points you earn', value: 3 }
};

const Play = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editCardId, setEditCardId] = useState(null);
  const [lastPointsEarned, setLastPointsEarned] = useState(0);
  const { columns, setColumns, cards, setCards, loading } = useKanbanBoard(defaultColumns, defaultCards);

  // Edit card handlers
  const handleEditCard = (cardId) => setEditCardId(cardId);
  const handleCloseEditModal = () => setEditCardId(null);
  const handleSaveEditCard = (updatedCard) => {
    setCards(prev => ({ ...prev, [updatedCard.id]: updatedCard }));
    setEditCardId(null);
  };

  // Mark card as completed: set completedAt and scoreAtCompletion
  const handleCompleteCard = (cardId) => {
    setCards(prev => {
      const card = prev[cardId];
      if (!card) return prev;
      // Calculate score at completion (using current multipliers)
      const completedAt = new Date().toISOString();
      const scoreAtCompletion = (card.value || 1) * weeklyMultiplier * rapidMultiplier;
      return {
        ...prev,
        [cardId]: {
          ...card,
          completedAt,
          scoreAtCompletion,
        },
      };
    });
  };
  const handleDeleteCard = (cardId) => {
    setCards(prev => {
      const newCards = { ...prev };
      delete newCards[cardId];
      return newCards;
    });
    setColumns(prev => {
      const newCols = { ...prev };
      Object.values(newCols).forEach(col => {
        col.cardIds = col.cardIds.filter(id => id !== cardId);
      });
      return newCols;
    });
    setEditCardId(null);
  };

  // Handler to create a new card
  const handleCreateCard = ({ title, description, tag, priority }) => {
    // Generate a unique card id
    const newId = `card-${Date.now()}`;
    const newCard = {
      id: newId,
      title,
      description,
      tag,
      priority,
      value: 1,
    };
    setCards(prev => ({ ...prev, [newId]: newCard }));
    setColumns(prev => {
      const queuedCol = prev['Queued'] || prev['column-1'];
      const queuedColId = queuedCol.id || 'Queued';
      return {
        ...prev,
        [queuedColId]: {
          ...queuedCol,
          cardIds: [newId, ...queuedCol.cardIds],
        },
      };
    });
    setIsModalOpen(false);
  };

  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);

  // Precompute total cards for performance
  // this section handles tag/indicator card count per column
  const totalCards = Object.values(columns).reduce((sum, col) => sum + col.cardIds.length, 0);

  // --- ScoreBox and Counter logic ---
  // Assume completed column is 'Completed' or fallback to 'column-3'
  const completedCol = columns['Completed'] || columns['column-3'] || { cardIds: [] };
  const completedCount = completedCol.cardIds.length;
  // Example: get multiplier (replace with real logic if needed)
  const weeklyMultiplier = 1.7; // placeholder, replace with real value if available
  const rapidMultiplier = 1.2; // placeholder, replace with real value if available
  const totalMultiplier = weeklyMultiplier * rapidMultiplier;
  const score = completedCount * totalMultiplier;

  // Track last points earned (simulate: 1 card = totalMultiplier points)
  useEffect(() => {
    // If completedCount increased, set lastPointsEarned
    if (completedCount > 0) {
      setLastPointsEarned(totalMultiplier);
    }
  }, [completedCount, totalMultiplier]);

  // Build dailyCards and weeklyScores for Counter
  const completedCards = Object.values(cards).filter(card => card.completedAt);
  const dailyCards = completedCards.filter(card => {
    const today = new Date();
    const start = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 0, 0, 0, 0);
    const end = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 23, 59, 59, 999);
    const date = new Date(card.completedAt);
    return date >= start && date <= end;
  });
  const weekStart = (() => {
    const now = new Date();
    const day = now.getDay();
    return new Date(now.getFullYear(), now.getMonth(), now.getDate() - day, 0, 0, 0, 0);
  })();
  const weeklyScores = completedCards
    .filter(card => new Date(card.completedAt) >= weekStart)
    .map(card => ({
      scoredAt: card.completedAt,
      score: card.scoreAtCompletion || 0,
    }));
  // Helper for tag text
  const getColumnTagText = (colId, column) => {
    if (colId === 'Completed') {
      return `${column.cardIds.length}/${totalCards}`;
    }
    if (colId === 'In Progress') {
      return `${column.cardIds.length}/${IN_PROGRESS_WIP}`;
    }
    if (colId === 'Queued') {
      // Remaining slots for Queued = QUEUED_LIMIT - (totalCards - column.cardIds.length)
      const remainingQueuedSlots = Math.max(QUEUED_LIMIT - (totalCards - column.cardIds.length), 0);
      return `${column.cardIds.length}/${remainingQueuedSlots}`;
    }
    return column.cardIds.length;
  };
  const queuedLimitReached = columns['Queued'] && columns['Queued'].cardIds.length >= QUEUED_LIMIT;

  if (loading) {
    return <div style={{ padding: 32, textAlign: 'center' }}>Loading board...</div>;
  }
  return (
    <div className="home-container">
  <div style={{ display: 'flex', flexDirection: 'row', gap: '.75rem', marginBottom: 24 }}>
    <div style={{ flex: 2 }}>
      <WeeklyProgressBar />
    </div>
    <div style={{ flex: 1 }}>
      <Counter dailyCards={dailyCards} weeklyScores={weeklyScores} />
    </div>
  </div>
    <Modal isOpen={isModalOpen} onClose={handleCloseModal}>
      {queuedLimitReached ? (
        <div style={{ padding: 24, textAlign: 'center', color: 'red' }}>
          Queued column is full ({QUEUED_LIMIT} card limit).
        </div>
      ) : (
        <CreateCardModal
          open={isModalOpen}
          onSave={handleCreateCard}
          onClose={handleCloseModal}
        />
      )}
    </Modal>
  <Board columns={columns} setColumns={setColumns} onCardComplete={handleCompleteCard}>
      {['Queued', 'In Progress', 'Completed'].map((colId) => {
        const column = columns[colId];
        if (!column) return null;
        const tagText = getColumnTagText(colId, column);
        return (
          <Column
            key={column.id}
            header={column.title}
            tagText={tagText}
            columnId={colId}
            cardIds={column.cardIds}
            wipLimitReached={colId === 'In Progress' && column.cardIds.length >= IN_PROGRESS_WIP}
          >
            {colId === 'Queued' && (
              <Button className="createCardButton" onClick={handleOpenModal} disabled={queuedLimitReached}>
                + Create Card
              </Button>
            )}
            {column.cardIds.map((cardId) => {
              const card = cards[cardId];
              if (!card) return null;
              return (
                <DragCard
                  key={card.id}
                  id={card.id}
                  title={card.title}
                  description={card.description}
                  tag={card.tag}
                  priority={card.priority}
                  value={card.value}
                  onClick={() => handleEditCard(card.id)}
                  onEdit={() => handleEditCard(card.id)}
                  onDelete={() => handleDeleteCard(card.id)}
                />
              );
            })}
          </Column>
        );
      })}
    </Board>
      {/* Edit Card Modal */}
      <EditCardModal
        open={!!editCardId}
        card={editCardId ? cards[editCardId] : null}
        onSave={handleSaveEditCard}
        onDelete={handleDeleteCard}
        onClose={handleCloseEditModal}
      />
  </div>
  );
};

export default Play;