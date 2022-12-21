import { useState, useEffect } from 'react';

export function useBackButtonListener(customBackHandler: Function): void {
  const [pressed, setPressed] = useState(false);

  useEffect(() => {
    window.onpopstate = (e) => {
      setPressed(true);
      customBackHandler();
    };
  });
}
