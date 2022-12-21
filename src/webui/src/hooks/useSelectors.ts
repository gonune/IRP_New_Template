import { useSelector, TypedUseSelectorHook } from 'react-redux';
import type { RootState } from '../state/store';

// ******************************************************************* //
// *** The only edits that need to be made to this file for new ****** //
// *** projects is to *add* additional custom hooks. Do not remove the //
// *** existing useCurrentUserIs function, just use it as a ********** //
// *** template to add more for other slices of the state store ****** //
// ******************************************************************* //

// TS has no idea what's in the Redux store so we need to add hints
const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

// Create a custom hook so that components can retrieve individual
// slices of data out of the store
export const useCurrentUserIs = () => {
  const currentUser = useAppSelector((state) => state.currentUser);

  return currentUser;
};
