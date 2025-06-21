import { useState, useEffect } from 'react';

export const useGlitchEffect = () => {
  const [glitchEffect, setGlitchEffect] = useState(false);

  useEffect(() => {
    const glitchTimer = setInterval(() => {
      setGlitchEffect(true);
      setTimeout(() => setGlitchEffect(false), 200);
    }, 8000);

    return () => {
      clearInterval(glitchTimer);
    };
  }, []);

  return { glitchEffect };
}; 