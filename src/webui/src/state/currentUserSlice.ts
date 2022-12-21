import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// Import types that describe the shape of the data in this slice
import { User, ReformattedUser } from '../types/User';

// ******************************************************************* //
// *** This file does not need to be edited for new projects ********* //
// ******************************************************************* //

export interface CurrentUserState {
  currentUser: ReformattedUser;
}

// Define an initial state that matches our interface
const initialState: CurrentUserState = {
  currentUser: {
    display_name: '',
    email: '',
    given_name: '',
    external_id: '',
    job_title: '',
    sur_name: '',
    user_principal_name: '',
    roles: [],
    id_token: null
  }
};

export const currentUserSlice = createSlice({
  name: 'currentUser',
  initialState,
  // The `reducers` field lets us define reducers with automatically generated associated actions
  reducers: {
    // Redux Toolkit allows us to write "mutating" logic in reducers. It
    // doesn't actually mutate the state because it uses the Immer library,
    // which detects changes to a "draft state" and produces a brand new
    // immutable state based off those changes
    setUser: (state, action: PayloadAction<User>) => {
      // Reshaping the data to match typical expected casing for APIs
      let reformattedCurrentUser: ReformattedUser = {
        display_name: '',
        email: '',
        given_name: '',
        external_id: '',
        job_title: '',
        sur_name: '',
        user_principal_name: '',
        roles: [],
        id_token: null
      };

      reformattedCurrentUser.display_name = action.payload.displayName;
      reformattedCurrentUser.email = action.payload.email;
      reformattedCurrentUser.given_name = action.payload.givenName;
      reformattedCurrentUser.external_id = action.payload.id;
      reformattedCurrentUser.job_title = action.payload.jobTitle;
      reformattedCurrentUser.sur_name = action.payload.jobTitle;
      reformattedCurrentUser.user_principal_name =
        action.payload.userPrincipalName;
      reformattedCurrentUser.roles = action.payload.roles;
      reformattedCurrentUser.id_token = action.payload.idToken;

      // Update the object in the state store with our new object
      state.currentUser = reformattedCurrentUser;
    },
    unsetUser: (state) => {
      // Update the object in the state store with an empty object
      state.currentUser = {
        display_name: '',
        email: '',
        given_name: '',
        external_id: '',
        job_title: '',
        sur_name: '',
        user_principal_name: '',
        roles: [],
        id_token: null
      };
    },
    updateRoles: (state, action: PayloadAction<string[]>) => {
      // Update the list of roles associated with the user to a list of strings that is passed to us
      state.currentUser.roles = action.payload;
    }
  }
});

// Export these action creators so that we can bind them to the dispatch() function in ../hooks/useActions.ts
export const currentUserActionCreators = currentUserSlice.actions;

// Export the reducer so we can import it in ./store.ts and add it to the root reducer
export default currentUserSlice.reducer;
