import { useState, useCallback } from 'react';

interface UseLocalStorageReturn<T> {
  value: T;
  setValue: (val: T) => void;
  removeValue: () => void;
}

/**
 * Hook para persistir valores en localStorage.
 * @param key - Clave de localStorage
 * @param initialValue - Valor inicial si no existe en storage
 */
const useLocalStorage = <T>(key: string, initialValue: T): UseLocalStorageReturn<T> => {
  const [value, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? (JSON.parse(item) as T) : initialValue;
    } catch {
      return initialValue;
    }
  });

  const setValue = useCallback(
    (val: T) => {
      try {
        setStoredValue(val);
        window.localStorage.setItem(key, JSON.stringify(val));
      } catch (error) {
        console.error('Error saving to localStorage', error);
      }
    },
    [key]
  );

  const removeValue = useCallback(() => {
    try {
      setStoredValue(initialValue);
      window.localStorage.removeItem(key);
    } catch (error) {
      console.error('Error removing from localStorage', error);
    }
  }, [key, initialValue]);

  return { value, setValue, removeValue };
};

export default useLocalStorage;
