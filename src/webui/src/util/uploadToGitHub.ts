// https://medium.com/axlewebtech/upload-a-file-in-github-using-github-apis-dbb6f38cc63
import axios from 'axios';

async function getSHA(repoOwner: string, repoName: string, token: string) {
  const config = {
    method: 'get',
    url: `https://api.github.com/repos/${repoOwner}/${repoName}/contents/.github/build/deploy-project.json`,
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/vnd.github+json'
    }
  };

  let res = await axios(config);
  let data = res.data;
  return data.sha;
}

async function updateExisting(
  response: any,
  data: any,
  config: any,
  repoOwner: string,
  repoName: string,
  token: string
) {
  const sha = await getSHA(repoOwner, repoName, token);
  data['sha'] = sha;
  config['data'] = data;
  const result = await axios(config);
  response = result;
  return response;
}

export const uploadToGitHubViaApi = (
  repoOwner: string,
  repoName: string,
  token: string,
  contents: string,
  replaceExisting: boolean
) => {
  let response: any = {};
  let data: any = {
    message: 'Programmatic upload via the Dynamic Template Generator App',
    content: `${contents}`
  };
  let config: any = {
    method: 'put',
    url: `https://api.github.com/repos/${repoOwner}/${repoName}/contents/.github/build/deploy-project.json`,
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/vnd.github+json'
    },
    data: JSON.stringify(data)
  };

  if (replaceExisting) {
    response = updateExisting(
      response,
      data,
      config,
      repoOwner,
      repoName,
      token
    );
  } else {
    response = axios(config);
  }
  return response;
};
