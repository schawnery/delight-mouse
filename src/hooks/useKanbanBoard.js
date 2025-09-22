import { useState, useEffect } from 'react';
import { getAllColumns, getAllCards, putColumn, putCard } from '../utils/kanbanDb';

/**
 * useKanbanBoard
 * Custom hook to manage Kanban columns and cards state with IndexedDB persistence.
 * Always sources state from IndexedDB, writing defaults if DB is empty.
 *
 * @param {object} defaultColumns - Default columns object
 * @param {object} defaultCards - Default cards object
 * @returns {object} { columns, setColumns, cards, setCards, loading }
 */
export function useKanbanBoard(defaultColumns, defaultCards) {
  const [columns, setColumns] = useState({});
  const [cards, setCards] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    async function load() {
      let dbColumns = await getAllColumns();
      let dbCards = await getAllCards();
      if (dbColumns.length && dbCards.length) {
        const columnsObj = {};
        dbColumns.forEach(col => {
          columnsObj[col.id] = {
            ...col,
            cardIds: Array.isArray(col.cardIds) ? col.cardIds : [],
          };
        });
        const cardsObj = {};
        dbCards.forEach(card => { cardsObj[card.id] = card; });
        if (mounted) {
          setColumns(columnsObj);
          setCards(cardsObj);
          setLoading(false);
        }
      } else {
        await Promise.all([
          ...Object.values(defaultColumns).map(col => putColumn(col)),
          ...Object.values(defaultCards).map(card => putCard(card)),
        ]);
        dbColumns = await getAllColumns();
        dbCards = await getAllCards();
        const columnsObj = {};
        dbColumns.forEach(col => {
          columnsObj[col.id] = {
            ...col,
            cardIds: Array.isArray(col.cardIds) ? col.cardIds : [],
          };
        });
        const cardsObj = {};
        dbCards.forEach(card => { cardsObj[card.id] = card; });
        if (mounted) {
          setColumns(columnsObj);
          setCards(cardsObj);
          setLoading(false);
        }
      }
    }
    load();
    return () => { mounted = false; };
  }, [defaultColumns, defaultCards]);

  // Persist columns to IndexedDB whenever columns state changes
  useEffect(() => {
    Object.values(columns).forEach(col => {
      putColumn(col);
    });
  }, [columns]);

  // Persist cards to IndexedDB whenever cards state changes
  useEffect(() => {
    Object.values(cards).forEach(card => {
      putCard(card);
    });
  }, [cards]);

  return { columns, setColumns, cards, setCards, loading };
}
