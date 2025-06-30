import { useEffect, useMemo } from "react";
import debounce from "lodash.debounce";

export function useDebouncedSearch<T extends (...args: any[]) => void>(
  callback: T,
  delay: number,
  deps: any[] = [],
): T {
  const debouncedFn = useMemo(() => debounce(callback, delay), deps);

  useEffect(() => {
    return () => {
      debouncedFn.cancel();
    };
  }, [debouncedFn]);

  return debouncedFn as unknown as T;
}
