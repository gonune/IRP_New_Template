// ******************************************************************* //
// *** This file does not need to be edited for new projects ********* //
// ******************************************************************* //

import { createContext, ReactNode } from 'react';

// Define what the value returned by this context should look like
interface ThemeColorsValue {
  primary: string;
  secondary: string;
  info: string;
  danger: string;
}

// Create the context and set default values for it
export const ThemeColorsContext = createContext<ThemeColorsValue>({
  primary: '',
  secondary: '',
  info: '',
  danger: ''
});

// Note that the context will receive the special `children` prop by default
interface ContextProps {
  children?: ReactNode;
}

// Implement the interface from above and make its properties available to all
// components wrapped by this context via a prop called `value` from which they
// can destructure out what they want; See the notes in ../index.tsx also
export const ThemeColorsProvider: React.FC<ContextProps> = ({ children }) => {
  const ThemeColorsObj = {
    primary: '#22344D',
    secondary: '#6D757D',
    info: '#0378CD',
    danger: '#b32020'
  };

  return (
    <ThemeColorsContext.Provider value={ThemeColorsObj}>
      {children}
    </ThemeColorsContext.Provider>
  );
};
