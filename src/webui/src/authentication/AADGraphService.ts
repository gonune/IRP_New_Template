var graph = require('@microsoft/microsoft-graph-client');

// ******************************************************************* //
// *** This file does not need to be edited for new projects ********* //
// ******************************************************************* //

function getAuthenticatedClient(accessToken: string) {
  // Initialize Graph Client
  const client = graph.Client.init({
    // Use the provided access token to authenticate
    // request
    authProvider: (done: any) => {
      done(null, accessToken);
    }
  });

  return client;
}

export async function getUserDetails(accessToken: string) {
  const client = getAuthenticatedClient(accessToken);

  const user = await client.api('/me').get();
  return user;
}
