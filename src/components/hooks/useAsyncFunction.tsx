/* eslint-disable no-unused-vars */

import { useCallback, useState } from "react";

export const useAsyncFunction = <T extends (...args: any[]) => any, R = any>(
  asyncFunction: T
) => {
  const [data, setData] = useState<R | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<any>(null);

  const execute = useCallback(
    async (...args: Parameters<T>) => {
      setLoading(true);
      try {
        const result = await asyncFunction(...args);
        setData(result);
        return result;
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    },
    [asyncFunction]
  );

  return { data, loading, error, execute };
};
