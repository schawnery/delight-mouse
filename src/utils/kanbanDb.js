import { openDB } from 'idb';

/**
 * =============================================
 * dbPromise
 * ---------------------------------------------
 * Opens (or creates) the Kanban IndexedDB database
 * with 'columns' and 'cards' object stores.
 * All other DB helpers use this promise to access the DB.
 * =============================================
 */
export const dbPromise = openDB('kanban-db', 1, {
  upgrade(db) {
    if (!db.objectStoreNames.contains('columns')) {
      db.createObjectStore('columns', { keyPath: 'id' });
    }
    if (!db.objectStoreNames.contains('cards')) {
      db.createObjectStore('cards', { keyPath: 'id' });
    }
  },
});

/**
 * =============================================
 * COLUMN HELPERS (CRUD for 'columns' store)
 * =============================================
 */

/**
 * getAllColumns
 * --------------
 * Returns all columns from the 'columns' object store in IndexedDB.
 */
export async function getAllColumns() {
  return (await dbPromise).getAll('columns');
}

/**
 * getColumn
 * ---------
 * Returns a single column by id from IndexedDB.
 */
export async function getColumn(id) {
  return (await dbPromise).get('columns', id);
}

/**
 * putColumn
 * ---------
 * Adds or updates a column in the 'columns' store in IndexedDB.
 */
export async function putColumn(column) {
  return (await dbPromise).put('columns', column);
}

/**
 * deleteColumn
 * ------------
 * Removes a column by id from the 'columns' store in IndexedDB.
 */
export async function deleteColumn(id) {
  return (await dbPromise).delete('columns', id);
}

/**
 * =============================================
 * CARD HELPERS (CRUD for 'cards' store)
 * =============================================
 */

/**
 * getAllCards
 * -----------
 * Returns all cards from the 'cards' object store in IndexedDB.
 */
export async function getAllCards() {
  return (await dbPromise).getAll('cards');
}

/**
 * getCard
 * -------
 * Returns a single card by id from IndexedDB.
 */
export async function getCard(id) {
  return (await dbPromise).get('cards', id);
}

/**
 * putCard
 * -------
 * Adds or updates a card in the 'cards' store in IndexedDB.
 */
export async function putCard(card) {
  return (await dbPromise).put('cards', card);
}

/**
 * deleteCard
 * ----------
 * Removes a card by id from the 'cards' store in IndexedDB.
 */
export async function deleteCard(id) {
  return (await dbPromise).delete('cards', id);
}
