import { useCallback } from 'react';

export default function useKanbanDnD(columnStates, columnSetters, STORAGE_KEYS) {
  // Handles moving cards between columns and reordering within a column
  return useCallback((draggedCard, targetColumn, hoverIndex = null) => {
    const sourceColumn = Object.keys(columnStates).find(col =>
      columnStates[col].some(card => card.timestamp === draggedCard.timestamp)
    );

    if (sourceColumn !== targetColumn) {
      const isDuplicate = columnStates[targetColumn].some(c => c.timestamp === draggedCard.timestamp);
      if (isDuplicate) return;
      if (sourceColumn) {
        columnSetters[sourceColumn](prev => prev.filter(c => c.timestamp !== draggedCard.timestamp));
      }
      columnSetters[targetColumn](prev => {
        let updatedColumn;
        if (hoverIndex !== null && hoverIndex >= 0) {
          updatedColumn = [...prev];
          updatedColumn.splice(hoverIndex, 0, draggedCard);
        } else {
          updatedColumn = [...prev, draggedCard];
        }
        return updatedColumn;
      });
    } else if (sourceColumn === targetColumn && hoverIndex !== null) {
      columnSetters[targetColumn](prev => {
        const dragIndex = prev.findIndex(card => card.timestamp === draggedCard.timestamp);
        if (dragIndex === -1 || dragIndex === hoverIndex) return prev;
        const updatedColumn = [...prev];
        updatedColumn.splice(dragIndex, 1);
        updatedColumn.splice(hoverIndex, 0, draggedCard);
        return updatedColumn;
      });
    }
  }, [columnStates, columnSetters, STORAGE_KEYS]);
}
