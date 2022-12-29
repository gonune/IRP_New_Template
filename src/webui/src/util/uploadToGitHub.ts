// https://medium.com/axlewebtech/upload-a-file-in-github-using-github-apis-dbb6f38cc63
import axios from 'axios';

export const uploadToGitHubViaApi = (
  repoOwner: string,
  repoName: string,
  token: string,
  contents: string
) => {
  var data = JSON.stringify({
    message: 'Programmatic upload via the Dynamic Template Generator App',
    content: `${contents}`
  });

  var config = {
    method: 'put',
    url: `https://api.github.com/repos/${repoOwner}/${repoName}/contents/.github/build/deploy-project.json`,
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/vnd.github+json'
    },
    data: data
  };

  const response = axios(config);
  return response;
};
