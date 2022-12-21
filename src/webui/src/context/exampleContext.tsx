// ******************************************************************* //
// *** This file is provided as a slightly-more-complicated example ** //
// *** of using the Context System than the themed colors example **** //
// ******************************************************************* //

import { createContext, useState, ReactNode } from 'react';

// Define what the value returned by this context should look like
interface ExampleContextValue {
  count: number;
  incrementCount: () => void;
}

// Create the context and set default values for it
export const ExampleContext = createContext<ExampleContextValue>({
  count: 0,
  incrementCount() {}
});

// Note that the context will receive the special `children` prop by default
interface ContextProps {
  children?: ReactNode;
}

// Implement the interface from above and make its properties available to all
// components wrapped by this context via a prop called `value` from which they
// can destructure out what they want; See the notes in ../index.tsx also
export const ExampleContextProvider: React.FC<ContextProps> = ({
  children
}) => {
  const [count, setCount] = useState(0);

  const exampleContextObj = {
    count,
    incrementCount: () => {
      setCount(count + 1);
    }
  };

  return (
    <ExampleContext.Provider value={exampleContextObj}>
      {children}
    </ExampleContext.Provider>
  );
};
