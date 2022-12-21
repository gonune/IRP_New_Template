// ******************************************************************* //
// *** This file does not need to be edited for new projects ********* //
// ******************************************************************* //

function getClientId(): string {
  const { REACT_APP_AAD_CLIENT_ID } = process.env;
  if (REACT_APP_AAD_CLIENT_ID) {
    return REACT_APP_AAD_CLIENT_ID;
  } else {
    return '';
  }
}

export const config = {
  appId: getClientId(),
  authority:
    'https://login.microsoftonline.com/b1c14d5c-3625-45b3-a430-9552373a0c2f',
  redirectUri: window.location.origin,
  postLogoutRedirectUri: window.location.origin,
  validateAuthority: true,
  scopes: ['user.read', 'openid', 'email']
};
