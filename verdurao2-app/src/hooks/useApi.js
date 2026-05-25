import { useState, useEffect, useCallback } from "react";

/**
 * Hook genérico para chamadas à API.
 *
 * @param {Function} serviceFn  — função do serviço, ex: getEstoque
 * @param {Array}    deps       — dependências para re-buscar (opcional)
 *
 * @example
 * const { data, loading, error, refetch } = useApi(getEstoque);
 */
export function useApi(serviceFn, deps = []) {
  const [data, setData]       = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(null);

  const fetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await serviceFn();
      setData(result);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  useEffect(() => { fetch(); }, [fetch]);

  return { data, loading, error, refetch: fetch };
}

/**
 * Hook para mutações (POST, PUT, PATCH, DELETE).
 *
 * @param {Function} serviceFn — função do serviço, ex: createVenda
 *
 * @example
 * const { mutate, loading, error } = useMutation(createVenda);
 * await mutate(dadosDaVenda);
 */
export function useMutation(serviceFn) {
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState(null);

  const mutate = useCallback(async (payload) => {
    setLoading(true);
    setError(null);
    try {
      const result = await serviceFn(payload);
      return result;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [serviceFn]);

  return { mutate, loading, error };
}