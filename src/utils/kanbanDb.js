import { openDB } from 'idb';

// Open (or create) the Kanban database with columns and cards stores
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

// COLUMN HELPERS
export async function getAllColumns() {
  return (await dbPromise).getAll('columns');
}
export async function getColumn(id) {
  return (await dbPromise).get('columns', id);
}
export async function putColumn(column) {
  return (await dbPromise).put('columns', column);
}
export async function deleteColumn(id) {
  return (await dbPromise).delete('columns', id);
}

// CARD HELPERS
export async function getAllCards() {
  return (await dbPromise).getAll('cards');
}
export async function getCard(id) {
  return (await dbPromise).get('cards', id);
}
export async function putCard(card) {
  return (await dbPromise).put('cards', card);
}
export async function deleteCard(id) {
  return (await dbPromise).delete('cards', id);
}
