import { useEffect, useState } from "react";

function useLocalStorage<T>(key: string, initialValue: T) {
  const [storedItem, setStoredItem] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(error);
      return initialValue;
    }
  });

  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(storedItem));
    } catch (error) {
      console.error(error);
    }
  }, [key, storedItem]);

  return [storedItem, setStoredItem] as const;
}

export default useLocalStorage;
