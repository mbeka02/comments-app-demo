import { useCallback, useState, useEffect } from "react";

export function useAsync(fn, dependncies = []) {
  const { exe, ...state } = AsyncInternal(fn, dependncies, true);

  useEffect(() => {
    exe();
  }, [exe]);
  return state;
}

export function useAsyncFn(fn, dependncies = []) {
  return AsyncInternal(fn, dependncies, false);
}

function AsyncInternal(fn, dependncies, initialLoading = false) {
  const [isLoading, setIsLoading] = useState(initialLoading);
  const [value, setValue] = useState();
  const [error, setError] = useState();

  const exe = useCallback((...params) => {
    setIsLoading(true);
    return fn(...params)
      .then((res) => {
        setValue(res);
        setError(undefined);
        return res;
      })
      .catch((err) => {
        setValue(undefined);
        setError(err);
        return Promise.reject(err);
      })
      .finally(() => {
        setTimeout(() => {
          setIsLoading(false);
        }, 1000);
      });
  }, dependncies);
  return { error, isLoading, value, exe };
}
