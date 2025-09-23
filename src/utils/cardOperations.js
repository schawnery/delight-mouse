// utils/cardOperations.js

/**
 * Calculate score multiplier based on weekly progress
 * Used when moving cards to completed column
 */
export const calculateScore = () => {
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
  return 2 * Math.exp(-1.0 * progress);
};

/**
 * Check if a card can be moved to the target column based on limits
 */
export const canMoveCard = (draggedCard, targetColumn, columnStates, WIP_LIMIT, TOTAL_CARD_LIMIT) => {
  // Enforce WIP limit for inProgressCards
  if (targetColumn === 'inProgressCards' && columnStates['inProgressCards'].length >= WIP_LIMIT) {
    return false;
  }
  
  // For startedCards (Queued), check total card limit
  if (targetColumn === 'startedCards') {
    const isAlreadyInQueued = columnStates['startedCards'].some(c => c.timestamp === draggedCard.timestamp);
    const totalActiveCards = columnStates['startedCards'].length + 
                            columnStates['inProgressCards'].length + 
                            columnStates['completedCards'].length;
    if (!isAlreadyInQueued && totalActiveCards >= TOTAL_CARD_LIMIT) {
      return false;
    }
  }
  
  return true;
};

/**
 * Find which column contains a specific card
 */
export const findSourceColumn = (draggedCard, columnStates) => {
  return Object.keys(columnStates).find(col => 
    columnStates[col].some(card => card.timestamp === draggedCard.timestamp)
  );
};

/**
 * Check if card already exists in target column
 */
export const isDuplicateCard = (draggedCard, targetColumn, columnStates) => {
  return columnStates[targetColumn].some(c => c.timestamp === draggedCard.timestamp);
};