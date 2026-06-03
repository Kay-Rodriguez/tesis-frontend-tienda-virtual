import { useEffect, useState } from "react";

export function useSlider(length = 0, interval = 3000) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (!length) return;

    const id = setInterval(() => {
      setIndex((prev) => (prev + 1) % length);
    }, interval);

    return () => clearInterval(id);
  }, [length, interval]);

  return [index, setIndex];
}