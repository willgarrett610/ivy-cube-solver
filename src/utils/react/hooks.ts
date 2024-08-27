import { useCallback, useEffect, useRef, useState } from 'react';

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

export const useScale = (
  startValue: number,
  endValue: number,
  fps = 30,
  durationMs: number,
) => {
  const [value, setValue] = useState(startValue);

  const [isPlaying, setIsPlaying] = useState(true);

  const [startTime, setStartTime] = useState(0);

  const [endTime, setEndTime] = useState(0);

  const play = useCallback(() => {
    setStartTime(Date.now());
    setEndTime(Date.now() + durationMs);
  }, [durationMs]);

  const reset = useCallback(() => {
    setStartTime(0);
    setEndTime(0);
    setValue(startValue);
    setIsPlaying(true);
    play();
  }, [play]);

  useEffect(() => {
    if (isPlaying) {
      play();
    }
  }, [isPlaying]);

  useEffect(() => {
    if (startTime && endTime) {
      const interval = setInterval(() => {
        const now = Date.now();
        const elapsed = now - startTime;
        const progress = elapsed / durationMs;
        const newValue = startValue + (endValue - startValue) * progress;
        setValue(newValue);

        if (now >= endTime) {
          clearInterval(interval);
          setIsPlaying(false);
          setValue(endValue);
        }
      }, 1000 / fps);

      return () => clearInterval(interval);
    }
  }, [startValue, endValue, startTime, endTime, durationMs, fps]);

  return { value, isPlaying, reset };
};

export const usePrevious = <T>(value: T) => {
  const ref = useRef<T>();
  useEffect(() => {
    ref.current = value; //assign the value of ref to the argument
  }, [value]); //this code will run when the value of 'value' changes
  return ref.current; //in the end, return the current ref value.
};
