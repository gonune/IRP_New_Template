import React from 'react';
import ReactDOM from 'react-dom/client';

import App from './App';
import { ThemeColorsProvider } from './context/themeColors';
import './styles/basic-swiper.css';
import './styles/card-effect-swiper.css';
// ******************************************************************* //
// *** The only edits that need to be made to this file are to add *** //
// *** the Context Providers that should wrap all of the components ** //
// *** in this app to the root.render() call below. The import and *** //
// *** and call to ExampleContextProvider should also be removed. **** //
// ******************************************************************* //

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <React.StrictMode>
    <ThemeColorsProvider>
      {/* This context provider will now receive our app in its `children` prop and */}
      {/* App and all its children will have access to the value prop from this context */}
      <App />
    </ThemeColorsProvider>
  </React.StrictMode>
);
