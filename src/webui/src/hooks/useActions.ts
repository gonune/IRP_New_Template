import { useDispatch } from 'react-redux';
import { bindActionCreators } from 'redux';

import { currentUserActionCreators } from '../state/currentUserSlice';

// ******************************************************************* //
// *** The only edits that need to be made to this file for new ****** //
// *** projects is to *add* additional custom hooks. Do not remove the //
// *** existing useCurrentUserActions function, just use it as a ***** //
// *** template to add more for other slices of the state store ****** //
// ******************************************************************* //

// Because hooks can only be called inside the body of a function component, we unfortunately
// cannot generalize this functionality and accept an actionCreators argument to tailor it,
// because then we'd be calling the general function from here, not a function component
export const useCurrentUserActions = () => {
  // Be able to invoke an action manually
  const dispatch = useDispatch();

  // Get back our action creators, but now when we use them they
  // will automatically call dispatch
  return bindActionCreators(currentUserActionCreators, dispatch);
};
