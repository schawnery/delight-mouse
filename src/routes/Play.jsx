// Play.jsx - Refactored
import React, { useState } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { FaPlus } from 'react-icons/fa';

// Components
import WeeklyProgressBar from '../components/WeeklyProgressBar/WeeklyProgressBar';
import ScoreBox from '../components/ScoreBox/ScoreBox';
import CardCreationModal from '../components/Modal/CardCreationModal';
import EnhancedKanbanColumn from '../components/Kanban/EnhancedKanbanColumn';

// Hooks
import { useKanbanState } from '../hooks/useKanbanState';
import { useCardOperations } from '../hooks/useCardOperations';

// Styles
import '../styles/Home.css';

/**
 * Play - Main Kanban board route for daily challenges and tasks.
 * Refactored for better maintainability and separation of concerns.
 */
const Play = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Custom hooks for state and operations
  const kanbanState = useKanbanState();
  const { columnStates, columnSetters, score, setScore } = kanbanState;
  
  const cardOperations = useCardOperations(columnStates, columnSetters, setScore);
  const { 
    totalActiveCards, 
    maxQueued, 
    handleCardMove, 
    handleDeleteCard, 
    handleCardSave,
    WIP_LIMIT,
    TOTAL_CARD_LIMIT 
  } = cardOperations;

  // Derived state
  const canCreateCard = totalActiveCards < TOTAL_CARD_LIMIT && 
                       columnStates.startedCards.length < maxQueued;

  // Event handlers
  const handleCreateCard = (cardData) => {
    columnSetters.startedCards(prev => [cardData, ...prev]);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="home-container">
        {/* Header Section */}
        <div style={{ 
          display: 'flex', 
          justifyContent: 'flex-end', 
          alignItems: 'center', 
          marginBottom: '8px' 
        }}>
          <ScoreBox score={score} />
          <button 
            className="generate-btn" 
            onClick={handleOpenModal}
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '6px', 
              fontWeight: 400, 
              fontSize: '1rem', 
              color: '#fff', 
              padding: '9px 18px', 
              height: '38px', 
              lineHeight: '20px' 
            }}
          >
            <FaPlus style={{ 
              fontSize: '0.95em', 
              fontWeight: 200, 
              color: '#fff' 
            }} />
            Create card
          </button>
        </div>

        {/* Progress Bar */}
        <WeeklyProgressBar />
        
        {/* Card Creation Modal */}
        <CardCreationModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          onCreateCard={handleCreateCard}
          maxQueued={maxQueued}
          canCreate={canCreateCard}
        />
        
        {/* Kanban Board */}
        <div className="kanban-board-row">
          <EnhancedKanbanColumn
            title="Queued"
            description="Get me done this week"
            cards={columnStates.startedCards}
            columnKey="startedCards"
            limit={maxQueued}
            onCardMove={handleCardMove}
            onCardDelete={handleDeleteCard}
            onCardSave={handleCardSave('startedCards')}
            WIP_LIMIT={WIP_LIMIT}
            maxQueued={maxQueued}
            TOTAL_CARD_LIMIT={TOTAL_CARD_LIMIT}
          />
          
          <EnhancedKanbanColumn
            title="In Progress"
            description="Things that are currently being worked on"
            cards={columnStates.inProgressCards}
            columnKey="inProgressCards"
            limit={WIP_LIMIT}
            onCardMove={handleCardMove}
            onCardDelete={handleDeleteCard}
            onCardSave={handleCardSave('inProgressCards')}
            WIP_LIMIT={WIP_LIMIT}
            maxQueued={maxQueued}
            TOTAL_CARD_LIMIT={TOTAL_CARD_LIMIT}
          />
          
          <EnhancedKanbanColumn
            title="Completed"
            description="Things that have been finished"
            cards={columnStates.completedCards}
            columnKey="completedCards"
            onCardMove={handleCardMove}
            onCardDelete={handleDeleteCard}
            onCardSave={handleCardSave('completedCards')}
            WIP_LIMIT={WIP_LIMIT}
            maxQueued={maxQueued}
            TOTAL_CARD_LIMIT={TOTAL_CARD_LIMIT}
          />
        </div>
      </div>
    </DndProvider>
  );
};

export default Play;