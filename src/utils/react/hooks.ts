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
