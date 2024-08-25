import { useEffect, useState } from 'react';

export const useIteration = (fps = 60) => {
  const [i, setI] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setI((i) => i + 1);
    }, 1000 / fps);
    return () => clearInterval(interval);
  }, [fps]);

  return i;
};

export const useScale = (start: number, end: number, fps = 60, durationMs: number) => {
  const [value, setValue] = useState(start);

  useEffect(() => {
    const interval = setInterval(() => {
      setValue((value) => {
        const delta = (end - start) / (durationMs / (1000 / fps));
        return Math.min(end, value + delta);
      });
    }, 1000 / fps);
    return () => clearInterval(interval);
  }, [fps, start, end, durationMs]);

  return value;
};
