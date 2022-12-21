// ******************************************************************* //
// *** Define all custom types in this file ************************** //
// ******************************************************************* //

export type User = {
  displayName: string;
  email: string;
  givenName: string;
  id: string;
  jobTitle: string;
  surname: string;
  userPrincipalName: string;
  roles: string[];
  idToken: null;
};

export type ReformattedUser = {
  display_name: string;
  email: string;
  given_name: string;
  external_id: string;
  job_title: string;
  sur_name: string;
  user_principal_name: string;
  roles: string[];
  id_token: null;
};
