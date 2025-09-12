import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaRedo, FaTrash } from 'react-icons/fa';
import { useDrag, useDrop, DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import Card from '../components/Card/Card';
import TextBox from '../components/TextBox/TextBox';
import EditableCard from '../components/Card/EditableCard';
import KanbanColumn from '../components/Kanban/KanbanColumn';
import DropZone from '../components/Kanban/DropZone';
import DraggableCard from '../components/Kanban/DraggableCard';
import { STORAGE_KEYS, COLUMNS, PROMPTS } from '../constants/kanban';
import { getStoredData, saveToStorage, generateTimestamp } from '../utils/storage';
import '../styles/Home.css';



const Dailys = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(1);
  const [textBoxValue, setTextBoxValue] = useState("");
  const [cardTitle, setCardTitle] = useState("");
  const [cardDescription, setCardDescription] = useState("");
  const [cardTag, setCardTag] = useState("");
  
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
  const [completedCards, setCompletedCards] = useState(() => 
    getStoredData(STORAGE_KEYS.completedCards)
  );
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

  // Event handlers
  const handleGenerateChallenge = useCallback(() => {
    const randomPrompt = PROMPTS[Math.floor(Math.random() * PROMPTS.length)];
    const timestamp = generateTimestamp();
    const newCard = { prompt: randomPrompt, timestamp, type: 'generated' };
    
    setCurrentPrompt(randomPrompt);
    setHistoryCards(prev => [newCard, ...prev]);
  }, []);

  const handleClearHistory = useCallback(() => {
    setHistoryCards([]);
  }, []);

  const handleSubmitEntry = useCallback(() => {
    const trimmedValue = textBoxValue.trim();
    if (!trimmedValue) return;

    const timestamp = generateTimestamp();
    const newCard = { prompt: trimmedValue, timestamp, type: 'textbox' };
    
    setHistoryCards(prev => [newCard, ...prev]);
    setTextBoxValue("");
  }, [textBoxValue]);

  const handleDeleteCard = useCallback((card, columnName) => {
    const setter = columnSetters[columnName];
    const storageKey = STORAGE_KEYS[columnName];
    
    setter(prev => {
      const updatedColumn = prev.filter(c => c.timestamp !== card.timestamp);
      saveToStorage(storageKey, updatedColumn);
      return updatedColumn;
    });
  }, []);

  // Enhanced drop handler that supports both column changes and reordering
  const handleCardMove = useCallback((draggedCard, targetColumn, hoverIndex = null) => {
    const sourceColumn = Object.keys(columnStates).find(col => 
      columnStates[col].some(card => card.timestamp === draggedCard.timestamp)
    );

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
        if (hoverIndex !== null && hoverIndex >= 0) {
          // Insert at specific position
          updatedColumn = [...prev];
          updatedColumn.splice(hoverIndex, 0, draggedCard);
        } else {
          // Add to end if no position specified
          updatedColumn = [...prev, draggedCard];
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
  const DropZone = ({ onDrop, children, columnKey, cards }) => {
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
            onEdit={() => {}}
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
        onDrop={(card, position) => handleCardMove(card, columnKey, position)}
        columnKey={columnKey}
        cards={cards}
      >
        <div className="challenge-content">
          <div className={getHeaderClass(columnKey)}>
            <h2>{title}</h2>
            <span className="kanban-count-pill">{cards.length}</span>
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

        <div style={{ 
          display: 'flex', 
          flexDirection: 'row',
          maxWidth: 'calc(100vw - 4rem)', 
          margin: '0', 
          gap: '1rem'
        }}>
          {/* Challenge Generation Column */}
          <main className="kanban-column">
            {activeTab === 1 && (
              <div className="challenge-content">
                <div className="main-window-header">
                  <h2>Create cards</h2>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1em', alignItems: 'center', marginBottom: '1em' }}>
                  <div className="input-with-counter">
                    <input
                      type="text"
                      placeholder="Title"
                      value={cardTitle}
                      onChange={e => {
                        if (e.target.value.length <= 55) {
                          setCardTitle(e.target.value);
                        }
                      }}
                      className={`text-box${cardTitle.length === 55 ? ' text-box-limit' : ''}`}
                      maxLength={55}
                      style={{ width: '100%', maxWidth: 400 }}
                    />
                    <span className="input-counter">{cardTitle.length}/55</span>
                  </div>
                  <div className="input-with-counter">
                    <textarea
                      placeholder="Description"
                      value={cardDescription}
                      onChange={e => {
                        if (e.target.value.length <= 140) {
                          setCardDescription(e.target.value);
                        }
                      }}
                      rows={2}
                      className={`text-box${cardDescription.length === 140 ? ' text-box-limit' : ''}`}
                      maxLength={140}
                    />
                    <span className="input-counter">{cardDescription.length}/140</span>
                  </div>
                  <input
                    type="text"
                    placeholder="Tag (optional)"
                    value={cardTag}
                    onChange={e => setCardTag(e.target.value)}
                    className="text-box"
                    style={{ marginBottom: '0.5em', width: '100%', maxWidth: 400 }}
                  />
                </div>
                <div className="cards-wrapper">
                  {historyCards.filter(card => card.type === 'editable').map((card, index) => (
                    <EditableCard
                      key={`${card.timestamp}-${index}`}
                      title={card.title}
                      description={card.description}
                      tag={card.tag}
                      timestamp={card.timestamp}
                      onEdit={() => {}}
                      onDelete={() => {
                        setHistoryCards(prev => prev.filter(c => c.timestamp !== card.timestamp));
                      }}
                    />
                  ))}
                </div>
                {/* Remove the Add Editable Card button and use the main submit button for editable card creation */}
                <div style={{ 
                  marginTop: '1em', 
                  display: 'flex', 
                  gap: '1em', 
                  justifyContent: 'center' 
                }}>
                  <button className="generate-btn" onClick={handleGenerateChallenge}>
                    <FaRedo className="icon-position" /> Generate
                  </button>
                  <button
                    className="submit-btn"
                    onClick={() => {
                      if (cardTitle.trim() && cardDescription.trim()) {
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
                      }
                    }}
                    disabled={!(cardTitle.trim() && cardDescription.trim())}
                  >
                    Submit
                  </button>
                </div>
              </div>
            )}
          </main>

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

export default Dailys;