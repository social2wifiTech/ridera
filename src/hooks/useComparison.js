import { useState, useCallback } from 'react';

export function useComparison() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const compare = useCallback(async (origin, destination) => {
    setLoading(true);
    setError(null);
    setData(null);
    try {
      const res = await fetch('/api/compare', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ origin, destination }),
      });
      const json = await res.json();
      if (!json.success) {
        setError(json.error || 'Error desconocido');
      } else {
        setData(json.data);
      }
    } catch {
      setError('No se pudo conectar con el servidor.');
    } finally {
      setLoading(false);
    }
  }, []);

  const reset = useCallback(() => {
    setData(null);
    setError(null);
  }, []);

  return { data, loading, error, compare, reset };
}

