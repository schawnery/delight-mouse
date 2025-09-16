// hooks/useCardOperations.js
import { useCallback } from 'react';
import { STORAGE_KEYS } from '../constants/kanban';
import { saveToStorage } from '../utils/storage';
import { 
  calculateScore, 
  canMoveCard, 
  findSourceColumn, 
  isDuplicateCard 
} from '../utils/cardOperations';

const WIP_LIMIT = 3;
const TOTAL_CARD_LIMIT = 35;

export const useCardOperations = (columnStates, columnSetters, setScore) => {
  // Calculate derived values
  const totalActiveCards = columnStates.startedCards.length + 
                          columnStates.inProgressCards.length + 
                          columnStates.completedCards.length;
  
  const maxQueued = Math.max(0, TOTAL_CARD_LIMIT - 
                            columnStates.inProgressCards.length - 
                            columnStates.completedCards.length);

  /**
   * Delete a card from a specified column
   */
  const handleDeleteCard = useCallback((card, columnName) => {
    const setter = columnSetters[columnName];
    
    setter(prev => {
      const updatedColumn = prev.filter(c => c.timestamp !== card.timestamp);
      // If removing from completedCards, subtract score
      if (columnName === 'completedCards' && card.score) {
        setScore(s => s - card.score);
      }
      saveToStorage(STORAGE_KEYS[columnName], updatedColumn);
      return updatedColumn;
    });
  }, [columnSetters, setScore]);

  /**
   * Move a card between columns or reorder within a column
   */
  const handleCardMove = useCallback((draggedCard, targetColumn, hoverIndex = null) => {
    const sourceColumn = findSourceColumn(draggedCard, columnStates);

    // Check if move is allowed
    if (!canMoveCard(draggedCard, targetColumn, columnStates, WIP_LIMIT, TOTAL_CARD_LIMIT)) {
      return;
    }

    // If moving to a different column
    if (sourceColumn !== targetColumn) {
      // Check for duplicates
      if (isDuplicateCard(draggedCard, targetColumn, columnStates)) return;

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
        let cardToAdd = { ...draggedCard };
        
        // If moving to completedCards, attach score at time of completion
        if (targetColumn === 'completedCards') {
          cardToAdd.score = calculateScore();
        }
        
        let updatedColumn;
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
        updatedColumn.splice(dragIndex, 1);
        updatedColumn.splice(hoverIndex, 0, draggedCard);
        
        saveToStorage(STORAGE_KEYS[targetColumn], updatedColumn);
        return updatedColumn;
      });
    }
  }, [columnStates, columnSetters]);

  /**
   * Save updated card data
   */
  const handleCardSave = useCallback((column) => (updatedCard) => {
    columnSetters[column](prev => {
      const updated = prev.map(c =>
        c.timestamp === updatedCard.timestamp ? { ...c, ...updatedCard } : c
      );
      saveToStorage(STORAGE_KEYS[column], updated);
      return updated;
    });
  }, [columnSetters]);

  return {
    totalActiveCards,
    maxQueued,
    handleDeleteCard,
    handleCardMove,
    handleCardSave,
    WIP_LIMIT,
    TOTAL_CARD_LIMIT
  };
};