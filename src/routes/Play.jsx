const WIP_LIMIT = 3;
const QUEUED_LIMIT = 35;
import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaRedo, FaTrash } from 'react-icons/fa';
import { FaPlus } from 'react-icons/fa';
import WeeklyProgressBar from '../components/WeeklyProgressBar/WeeklyProgressBar';
import ScoreBox from '../components/ScoreBox/ScoreBox';
import { useDrag, useDrop, DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import Card from '../components/Card/Card';
import TextBox from '../components/TextBox/TextBox';
import EditableCard from '../components/Card/EditableCard';
import Modal from '../components/Modal/Modal';
import KanbanColumn from '../components/Kanban/KanbanColumn';
import DropZone from '../components/Kanban/DropZone';
import DraggableCard from '../components/Kanban/DraggableCard';
import { STORAGE_KEYS, COLUMNS, PROMPTS } from '../constants/kanban';
import { getStoredData, saveToStorage, generateTimestamp } from '../utils/storage';
import '../styles/Home.css';



/**
 * Play - Main Kanban board route for daily challenges and tasks.
 * Features:
 *   - Card creation, editing, drag-and-drop between columns
 *   - LocalStorage persistence
 *   - Challenge prompt generation
 *   - Character limits and counters
 */
const Play = () => {
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editingCard, setEditingCard] = useState(null);
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(1);
  const [textBoxValue, setTextBoxValue] = useState("");
  const [cardTitle, setCardTitle] = useState("");
  const [cardDescription, setCardDescription] = useState("");
  const [cardTag, setCardTag] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Initialize state from localStorage
  const [historyCards, setHistoryCards] = useState(() => 
    getStoredData(STORAGE_KEYS.historyCards)
  );
  const [startedCards, setStartedCards] = useState(() => 
    getStoredData(STORAGE_KEYS.startedCards)
  );
  const [inProgressCards, setInProgressCards] = useState(() => 
    getStoredData(STORAGE_KEYS.inProgressCards)
  );
  // Each completed card stores its score at completion
  const [completedCards, setCompletedCards] = useState(() => 
    getStoredData(STORAGE_KEYS.completedCards)
  );
  const [score, setScore] = useState(0);
  const [currentPrompt, setCurrentPrompt] = useState(() => 
    localStorage.getItem(STORAGE_KEYS.currentPrompt) || ''
  );

  // Column state management
  const columnStates = {
    [COLUMNS.historyCards]: historyCards,
    [COLUMNS.startedCards]: startedCards,
    [COLUMNS.inProgressCards]: inProgressCards,
    [COLUMNS.completedCards]: completedCards
  };

  const columnSetters = {
    [COLUMNS.historyCards]: setHistoryCards,
    [COLUMNS.startedCards]: setStartedCards,
    [COLUMNS.inProgressCards]: setInProgressCards,
    [COLUMNS.completedCards]: setCompletedCards
  };

  // Persist data to localStorage
  useEffect(() => {
    saveToStorage(STORAGE_KEYS.historyCards, historyCards);
    saveToStorage(STORAGE_KEYS.startedCards, startedCards);
    saveToStorage(STORAGE_KEYS.inProgressCards, inProgressCards);
    saveToStorage(STORAGE_KEYS.completedCards, completedCards);
    localStorage.setItem(STORAGE_KEYS.currentPrompt, currentPrompt);
  }, [historyCards, startedCards, inProgressCards, completedCards, currentPrompt]);

  // Update score when completedCards changes
  useEffect(() => {
    const total = completedCards.reduce((acc, card) => acc + (card.score || 0), 0);
    setScore(total);
  }, [completedCards]);

  // Event handlers
  /**
   * Generate a random challenge prompt and add to history.
   */
  const handleGenerateChallenge = useCallback(() => {
    const randomPrompt = PROMPTS[Math.floor(Math.random() * PROMPTS.length)];
    const timestamp = generateTimestamp();
    const newCard = { prompt: randomPrompt, timestamp, type: 'generated' };
    
    setCurrentPrompt(randomPrompt);
    setHistoryCards(prev => [newCard, ...prev]);
  }, []);

  /**
   * Submit a new entry from the text box to history.
   */
  const handleSubmitEntry = useCallback(() => {
    const trimmedValue = textBoxValue.trim();
    if (!trimmedValue) return;

    const timestamp = generateTimestamp();
    const newCard = { prompt: trimmedValue, timestamp, type: 'textbox' };
    
    setHistoryCards(prev => [newCard, ...prev]);
    setTextBoxValue("");
  }, [textBoxValue]);

  /**
   * Delete a card from a specified column.
   * @param {Object} card - Card object to delete
   * @param {string} columnName - Column key
   */
  const handleDeleteCard = useCallback((card, columnName) => {
    const setter = columnSetters[columnName];
    const storageKey = STORAGE_KEYS[columnName];
    
    setter(prev => {
      let updatedColumn = prev.filter(c => c.timestamp !== card.timestamp);
      // If removing from completedCards, subtract score
      if (columnName === 'completedCards' && card.score) {
        setScore(s => s - card.score);
      }
      saveToStorage(storageKey, updatedColumn);
      return updatedColumn;
    });
  }, []);

  // Enhanced drop handler that supports both column changes and reordering
  /**
   * Move a card between columns or reorder within a column.
   * @param {Object} draggedCard - Card being moved
   * @param {string} targetColumn - Target column key
   * @param {number|null} hoverIndex - Position to insert card
   */
  const handleCardMove = useCallback((draggedCard, targetColumn, hoverIndex = null) => {
    const sourceColumn = Object.keys(columnStates).find(col => 
      columnStates[col].some(card => card.timestamp === draggedCard.timestamp)
    );

    // Enforce WIP limits for inProgressCards and startedCards (Queued)
    if (
      (targetColumn === 'inProgressCards' && columnStates['inProgressCards'].length >= WIP_LIMIT) ||
      (targetColumn === 'startedCards' && columnStates['startedCards'].length >= QUEUED_LIMIT)
    ) {
      // Do nothing: card stays in original column
      return;
    }

    // If moving to a different column
    if (sourceColumn !== targetColumn) {
      // Check if card already exists in target column
      const isDuplicate = columnStates[targetColumn].some(c => c.timestamp === draggedCard.timestamp);
      if (isDuplicate) return;

      // Remove from source column
      if (sourceColumn) {
        columnSetters[sourceColumn](prev => {
          const updatedColumn = prev.filter(c => c.timestamp !== draggedCard.timestamp);
          saveToStorage(STORAGE_KEYS[sourceColumn], updatedColumn);
          return updatedColumn;
        });
      }

      // Add to target column at specified position
      columnSetters[targetColumn](prev => {
        let updatedColumn;
        let cardToAdd = { ...draggedCard };
        // If moving to completedCards, attach score at time of completion
        if (targetColumn === 'completedCards') {
          // Get current multiplier from WeeklyProgressBar logic
          const now = new Date();
          const day = now.getDay();
          const lastSunday = new Date(now);
          lastSunday.setDate(now.getDate() - day);
          lastSunday.setHours(12, 0, 0, 0);
          if (day === 0 && now.getHours() < 12) lastSunday.setDate(lastSunday.getDate() - 7);
          const nextSunday = new Date(lastSunday);
          nextSunday.setDate(lastSunday.getDate() + 7);
          const total = nextSunday - lastSunday;
          const elapsed = now - lastSunday;
          const progress = Math.min(Math.max(elapsed / total, 0), 1);
          const multiplier = 2 * Math.exp(-1.0 * progress);
          cardToAdd.score = multiplier;
        }
        if (hoverIndex !== null && hoverIndex >= 0) {
          updatedColumn = [...prev];
          updatedColumn.splice(hoverIndex, 0, cardToAdd);
        } else {
          updatedColumn = [...prev, cardToAdd];
        }
        saveToStorage(STORAGE_KEYS[targetColumn], updatedColumn);
        return updatedColumn;
      });
    } 
    // If reordering within the same column
    else if (sourceColumn === targetColumn && hoverIndex !== null) {
      columnSetters[targetColumn](prev => {
        const dragIndex = prev.findIndex(card => card.timestamp === draggedCard.timestamp);
        if (dragIndex === -1 || dragIndex === hoverIndex) return prev;

        const updatedColumn = [...prev];
        // Remove the card from its current position
        updatedColumn.splice(dragIndex, 1);
        // Insert it at the new position
        updatedColumn.splice(hoverIndex, 0, draggedCard);
        
        saveToStorage(STORAGE_KEYS[targetColumn], updatedColumn);
        return updatedColumn;
      });
    }
  }, [columnStates, columnSetters]);

  // Enhanced DropZone that supports positioning
  const DropZone = ({ onDrop, children}) => {
    const [{ isOver }, drop] = useDrop(() => ({
      accept: 'CARD',
      drop: (item, monitor) => {
        // If dropped on the column but not on a specific card, add to end
        if (!monitor.didDrop()) {
          onDrop(item, null);
        }
      },
      collect: (monitor) => ({
        isOver: monitor.isOver({ shallow: true }),
      }),
    }));

    return (
      <div
        ref={drop}
        style={{
          flex: 1,
          width: '100%',
          backgroundColor: isOver ? '#9deb9dff' : 'transparent',
          transition: 'background-color 0.3s ease',
          minHeight: '200px', // Ensure there's always a drop area
        }}
      >
        {children}
      </div>
    );
  };

  // Enhanced DraggableCard with hover detection for positioning
  const DraggableCard = ({ card, column, index }) => {
    const [{ isDragging }, drag] = useDrag(() => ({
      type: 'CARD',
      item: { ...card, sourceColumn: column },
      collect: (monitor) => ({
        isDragging: monitor.isDragging(),
      }),
    }));

    const [{ handlerId }, drop] = useDrop(() => ({
      accept: 'CARD',
      drop: (draggedCard, monitor) => {
        if (!draggedCard || draggedCard.timestamp === card.timestamp) return;
        
        // Handle drop on this specific card position
        handleCardMove(draggedCard, column, index);
      },
      collect: (monitor) => ({
        handlerId: monitor.getHandlerId(),
      }),
      hover: (draggedCard, monitor) => {
        if (!draggedCard || draggedCard.timestamp === card.timestamp) return;
        
        // Optional: Add visual feedback during hover
        // You can implement hover highlighting here if desired
      }
    }));

    const attachToCard = (el) => {
      drag(drop(el));
    };

    if (card.type === 'editable') {
      return (
        <div
          ref={attachToCard}
          data-handler-id={handlerId}
          style={{
            opacity: isDragging ? 0.5 : 1,
            cursor: 'move',
            position: 'relative',
            marginBottom: '8px',
          }}
        >
          <EditableCard
            title={card.title}
            description={card.description}
            tag={card.tag}
            timestamp={card.timestamp}
            onEdit={() => {
              setEditingCard({ ...card, column });
              setEditModalOpen(true);
            }}
            onDelete={() => {
              columnSetters[column](prev => prev.filter(c => c.timestamp !== card.timestamp));
            }}
            onSave={updatedCard => {
              columnSetters[column](prev => {
                const updated = prev.map(c =>
                  c.timestamp === card.timestamp ? { ...c, ...updatedCard } : c
                );
                saveToStorage(STORAGE_KEYS[column], updated);
                return updated;
              });
            }}
          />
      {editModalOpen && editingCard && (
        <Modal isOpen={editModalOpen} onClose={() => setEditModalOpen(false)}>
          <div className="modal-header">
            <div className="modal-title">Edit Card</div>
            <div className="modal-desc">Edit the card details below. Changes will be saved to the selected card.</div>
          </div>
          <div className="modal-form-row">
            <label className="modal-label" htmlFor="edit-title">Title *</label>
            <input
              id="edit-title"
              type="text"
              className="modal-input"
              placeholder="Enter card title..."
              value={editingCard.title}
              maxLength={55}
              required
              onChange={e => setEditingCard({ ...editingCard, title: e.target.value })}
            />
            <div className={`input-counter${editingCard.title.length === 55 ? ' input-counter-limit' : ''}`}>{editingCard.title.length}/55</div>
          </div>
          <div className="modal-form-row">
            <label className="modal-label" htmlFor="edit-desc">Description</label>
            <TextBox
              id="edit-desc"
              value={editingCard.description}
              onChange={e => setEditingCard({ ...editingCard, description: e.target.value })}
              placeholder="Enter card description..."
              rows={3}
              maxLength={140}
            />
            <div className={`input-counter${editingCard.description.length === 140 ? ' input-counter-limit' : ''}`}>{editingCard.description.length}/140</div>
          </div>
          <div className="modal-form-row">
            <label className="modal-label" htmlFor="edit-tag">Tag</label>
            <input
              id="edit-tag"
              type="text"
              className="modal-input"
              placeholder="Enter tag (optional)..."
              value={editingCard.tag || ''}
              maxLength={30}
              onChange={e => setEditingCard({ ...editingCard, tag: e.target.value })}
            />
          </div>
          <div className="card-create-actions">
            <button
              className="submit-btn"
              onClick={() => {
                columnSetters[editingCard.column](prev => prev.map(c =>
                  c.timestamp === editingCard.timestamp ? { ...c, ...editingCard } : c
                ));
                setEditModalOpen(false);
              }}
              disabled={editingCard.title.trim() === '' || editingCard.description.trim() === ''}
            >Save</button>
            <button className="cancel-btn" onClick={() => setEditModalOpen(false)}>Cancel</button>
          </div>
        </Modal>
      )}
        </div>
      );
    }

    return (
      <div
        ref={attachToCard}
        data-handler-id={handlerId}
        style={{
          opacity: isDragging ? 0.5 : 1,
          cursor: 'move',
          position: 'relative',
          marginBottom: '8px',
        }}
      >
        <Card>
          <p>{card.prompt}</p>
          <span className="card-timestamp">{card.timestamp}</span>
          <FaTrash
            style={{
              position: 'absolute',
              top: '5px',
              right: '5px',
              cursor: 'pointer',
              color: 'grey',
            }}
            onClick={(e) => {
              e.stopPropagation(); // Prevent drag from triggering
              handleDeleteCard(card, column);
            }}
          />
        </Card>
      </div>
    );
  };

  // Enhanced KanbanColumn with reordering support
  const getHeaderClass = (columnKey) => {
    if (columnKey === 'startedCards') return 'main-window-header queued';
    if (columnKey === 'inProgressCards') return 'main-window-header inprogress';
    if (columnKey === 'completedCards') return 'main-window-header completed';
    if (columnKey === 'historyCards') return 'main-window-header history';
    return 'main-window-header';
  };

  const KanbanColumn = ({ title, description, cards, columnKey }) => (
    <main className="kanban-column">
      <DropZone 
        onDrop={(card, position) => {
          // Prevent dropping if WIP limit reached for inProgressCards or Queued
          if ((columnKey === 'inProgressCards' && cards.length >= WIP_LIMIT) ||
              (columnKey === 'startedCards' && cards.length >= QUEUED_LIMIT)) return;
          handleCardMove(card, columnKey, position);
        }}
        columnKey={columnKey}
        cards={cards}
      >
        <div className="challenge-content">
          <div className={getHeaderClass(columnKey)}>
            <h2>{title}</h2>
            <span className="kanban-count-pill">
              {columnKey === 'inProgressCards'
                ? `${cards.length}/${WIP_LIMIT}`
                : columnKey === 'startedCards'
                  ? `${cards.length}/${QUEUED_LIMIT}`
                  : cards.length}
            </span>
          </div>
          <div className={columnKey === 'historyCards' ? 'cards-wrapper' : 'right-cards-wrapper'}>
            {cards.map((card, index) => (
              <DraggableCard 
                key={`${card.timestamp}-${index}`} 
                card={card}   
                column={columnKey}
                index={index}
              />
            ))}
          </div>
        </div>
      </DropZone>
    </main>
  );

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="home-container">
        <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', marginBottom: '8px' }}>
          <ScoreBox score={score} />
          <button className="generate-btn" onClick={() => setIsModalOpen(true)} style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 400, fontSize: '1rem', color: '#fff', padding: '9px 18px', height: '38px', lineHeight: '20px' }}>
            <FaPlus style={{ fontSize: '0.95em', fontWeight: 200, color: '#fff' }} />
            Create card
          </button>
        </div>
        <WeeklyProgressBar />
        <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
          <div className="modal-header">
            <div>
              <div className="modal-title">Create New Card</div>
              <div className="modal-desc">Add a new task card to your kanban board. It will be added to the Queued column.</div>
            </div>
          </div>
          <form
            onSubmit={e => {
              e.preventDefault();
              if (
                cardTitle.trim() &&
                startedCards.length < 35
              ) {
                const timestamp = new Date().toLocaleString();
                setStartedCards([
                  {
                    title: cardTitle.trim(),
                    description: cardDescription.trim(),
                    tag: cardTag.trim(),
                    timestamp,
                    type: 'editable',
                  },
                  ...startedCards,
                ]);
                setCardTitle("");
                setCardDescription("");
                setCardTag("");
                setIsModalOpen(false);
              }
            }}
          >
            <div className="modal-form-row">
              <label className="modal-label" htmlFor="modal-title">Title *</label>
              <input
                id="modal-title"
                type="text"
                className="modal-input"
                placeholder="Enter card title..."
                value={cardTitle}
                onChange={e => {
                  if (e.target.value.length <= 55) {
                    setCardTitle(e.target.value);
                  }
                }}
                maxLength={55}
                required
              />
              <div className={`input-counter${cardTitle.length === 55 ? ' input-counter-limit' : ''}`}>{cardTitle.length}/55</div>
            </div>
            <div className="modal-form-row">
              <label className="modal-label" htmlFor="modal-desc">Description</label>
              <TextBox
                id="modal-desc"
                value={cardDescription}
                onChange={e => {
                  if (e.target.value.length <= 140) {
                    setCardDescription(e.target.value);
                  }
                }}
                placeholder="Enter card description..."
                rows={3}
                maxLength={140}
              />
              <div className={`input-counter${cardDescription.length === 140 ? ' input-counter-limit' : ''}`}>{cardDescription.length}/140</div>
            </div>
            <div className="modal-form-row">
              <label className="modal-label" htmlFor="modal-tag">Tag</label>
              <input
                id="modal-tag"
                type="text"
                className="modal-input"
                placeholder="Enter tag (optional)..."
                value={cardTag}
                onChange={e => setCardTag(e.target.value)}
                maxLength={32}
              />
            </div>
            <div className="modal-actions">
              <button
                type="button"
                className="modal-cancel-btn"
                onClick={() => setIsModalOpen(false)}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="modal-submit-btn"
                disabled={
                  !cardTitle.trim() ||
                  startedCards.length >= 35
                }
              >
                Create Card
              </button>
            </div>
          </form>
        </Modal>
        <div className="kanban-board-row">
          {/* Challenge Generation Column */}
          

          {/* Kanban Columns */}
          <KanbanColumn
            title="Queued"
            description="Get me done this week"
            cards={startedCards}
            columnKey="startedCards"
          />
          
          <KanbanColumn
            title="In Progress"
            description="Things that are currently being worked on"
            cards={inProgressCards}
            columnKey="inProgressCards"
          />
          
          <KanbanColumn
            title="Completed"
            description="Things that have been finished"
            cards={completedCards}
            columnKey="completedCards"
          />
        </div>
      </div>
    </DndProvider>
  );
};

export default Play;