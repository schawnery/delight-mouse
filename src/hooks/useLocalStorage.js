import { useEffect } from 'react';

export default function useLocalStorage(keys, values, saveToStorage) {
  useEffect(() => {
    keys.forEach((key, i) => {
      saveToStorage(key, values[i]);
    });
  }, values);
}
