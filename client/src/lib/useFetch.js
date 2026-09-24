import { useCallback, useEffect, useState } from 'react';
import api from './api';

// Tiny data hook: const { data, loading, error, reload, setData } = useFetch('/suites')
export default function useFetch(url, initial = null) {
  const [data, setData] = useState(initial);
  const [loading, setLoading] = useState(Boolean(url));
  const [error, setError] = useState(null);

  const reload = useCallback(async () => {
    if (!url) return;
    setLoading(true);
    try {
      const res = await api.get(url);
      setData(res.data);
      setError(null);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, [url]);

  useEffect(() => {
    reload();
  }, [reload]);

  return { data, loading, error, reload, setData };
}
