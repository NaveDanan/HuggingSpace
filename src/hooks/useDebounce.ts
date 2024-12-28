import { useEffect } from 'react';

export function useDebounce(
  callback: () => void,
  delay: number,
  dependencies: any[]
) {
  useEffect(() => {
    const timeout = setTimeout(callback, delay);
    return () => clearTimeout(timeout);
  }, [...dependencies, callback, delay]);
}