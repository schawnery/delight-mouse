// hooks/useKanbanState.js
import { useState, useEffect } from 'react';
import { STORAGE_KEYS, COLUMNS } from '../constants/kanban';
import { getStoredData, saveToStorage } from '../utils/storage';

export const useKanbanState = () => {
  // Initialize state from localStorage
  const [startedCards, setStartedCards] = useState(() => 
    getStoredData(STORAGE_KEYS.startedCards)
  );
  const [inProgressCards, setInProgressCards] = useState(() => 
    getStoredData(STORAGE_KEYS.inProgressCards)
  );
  const [completedCards, setCompletedCards] = useState(() => 
    getStoredData(STORAGE_KEYS.completedCards)
  );
  const [score, setScore] = useState(0);
  const [currentPrompt, setCurrentPrompt] = useState(() => 
    localStorage.getItem(STORAGE_KEYS.currentPrompt) || ''
  );

  // Column state management
  const columnStates = {
    [COLUMNS.startedCards]: startedCards,
    [COLUMNS.inProgressCards]: inProgressCards,
    [COLUMNS.completedCards]: completedCards
  };

  const columnSetters = {
    [COLUMNS.startedCards]: setStartedCards,
    [COLUMNS.inProgressCards]: setInProgressCards,
    [COLUMNS.completedCards]: setCompletedCards
  };

  // Persist data to localStorage
  useEffect(() => {
    saveToStorage(STORAGE_KEYS.startedCards, startedCards);
    saveToStorage(STORAGE_KEYS.inProgressCards, inProgressCards);
    saveToStorage(STORAGE_KEYS.completedCards, completedCards);
    localStorage.setItem(STORAGE_KEYS.currentPrompt, currentPrompt);
  }, [startedCards, inProgressCards, completedCards, currentPrompt]);

  // Update score when completedCards changes
  useEffect(() => {
    const total = completedCards.reduce((acc, card) => acc + (card.score || 0), 0);
    setScore(total);
  }, [completedCards]);

  return {
    columnStates,
    columnSetters,
    score,
    setScore,
    currentPrompt,
    setCurrentPrompt
  };
};