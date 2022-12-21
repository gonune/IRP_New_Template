import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';

import currentUserReducer from './currentUserSlice';
import catalogItemsApi from './exampleCatalogItemsSlice';

// ******************************************************************* //
// *** The only edits that need to be made to this file for new ****** //
// *** projects is to *add* additional state slices to the root ****** //
// *** reducer below. Do not remove the existing reference to the **** //
// *** currentUser reducer, just use it as a template to add more **** //
// ******************************************************************* //

export const store = configureStore({
  reducer: {
    currentUser: currentUserReducer,
    // This sytax reads: go look up the reducerPath (we set it to 'catalogItems') and
    // put a new key inside of this object named whatever that is
    [catalogItemsApi.reducerPath]: catalogItemsApi.reducer
  },
  // This is required to make calls out of this app to external APIs
  middleware: (getDefaultMiddleware) => {
    return getDefaultMiddleware({
      // HACK: This allows us to temporarily deal with the fact that the
      // id_token value in currentUser is unserializable
      // https://redux-toolkit.js.org/usage/usage-guide#working-with-non-serializable-data
      // https://redux.js.org/faq/actions#why-should-type-be-a-string-or-at-least-serializable-why-should-my-action-types-be-constants
      serializableCheck: {
        // Ignore these field paths in all actions
        ignoredActionPaths: ['payload.id_token'],
        // Ignore these paths in the state
        ignoredPaths: ['payload.id_token']
      }
      // Add our custom API
    }).concat(catalogItemsApi.middleware);
  }
});

// Required setup
setupListeners(store.dispatch);

export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
