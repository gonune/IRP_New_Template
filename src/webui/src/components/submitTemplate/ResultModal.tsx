import { useState } from 'react';
import {
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Form,
  FormGroup,
  Input,
  Label,
  Alert,
  Spinner
} from 'reactstrap';
import { AxiosError } from 'axios';
import { Buffer } from 'buffer';

import { CustomButton } from '../genericHOCs/CustomButton';
import { uploadToGitHubViaApi } from '../../util/uploadToGitHub';
import { GitHubInputs } from './GitHubInputs';
import { JsonTypes } from '@azure/msal-common/dist/utils/Constants';

interface ResultModalProps {
  modal: boolean;
  toggleModal: any;
  contents: any;
}

interface ResponseMessageProps {
  loadingFlag: boolean;
  status: number;
  message: string;
  contents: string;
  downloadFile: Function;
}

interface DownloadLinkProps {
  responseStatus: number;
  contentsStr: string;
  downloadFile: Function;
}

const DownloadLink: React.FC<DownloadLinkProps> = ({
  responseStatus,
  contentsStr,
  downloadFile
}) => {
  if (responseStatus === 201) {
    return (
      <CustomButton color="link" onClick={() => downloadFile(contentsStr)}>
        Local download (optional)
      </CustomButton>
    );
  } else {
    return null;
  }
};

const ResponseMessage: React.FC<ResponseMessageProps> = ({
  loadingFlag,
  status,
  message,
  contents,
  downloadFile
}) => {
  if (status === 0 && loadingFlag) {
    return <Spinner className="m-auto" color="primary" />;
  } else if (status === 201 && downloadFile) {
    return (
      <Alert color="primary">
        {message}
        <DownloadLink
          responseStatus={status}
          contentsStr={contents}
          downloadFile={downloadFile}
        />
      </Alert>
    );
  } else if (status !== 0) {
    return (
      <Alert color="danger">
        {status}: {message}
      </Alert>
    );
  }

  return null;
};

export const ResultModal: React.FC<ResultModalProps> = ({
  modal,
  toggleModal,
  contents
}) => {
  const [githubChecked, setGithubChecked] = useState(false);
  const [repoOwner, setRepoOwner] = useState('sas-institute-solutions-factory');
  const [repoName, setRepoName] = useState('');
  const [response, setResponse] = useState({
    loading: false,
    status: 0,
    message: ''
  });
  const [downloadChecked, setDownloadChecked] = useState(false);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { target } = event;
    const { name, value } = target;

    if (name === 'upload-to-github') {
      setGithubChecked(!githubChecked);
    } else if (name === 'download') {
      setDownloadChecked(!downloadChecked);
    } else if (name === 'repo-owner') {
      setRepoOwner(value);
    } else if (name === 'repo-name') {
      setRepoName(value);
    }
  };

  const reset = () => {
    setGithubChecked(false);
    setDownloadChecked(false);
    setRepoOwner('sas-institute-solutions-factory');
    setRepoName('');
    setResponse({
      loading: false,
      status: 0,
      message: ''
    });
  };

  const handleClose = () => {
    reset();
    toggleModal();
  };
  const handleDownload = (contentsStr: string) => {
    const blob = new Blob([contentsStr]);
    const element = document.createElement('a');
    element.href = URL.createObjectURL(blob);
    element.download = 'deploy-project.json';
    document.body.appendChild(element); // Required for this to work in FireFox
    element.click();
    setResponse((prevState) => ({ ...prevState, [response.status]: 201 }));
  };
  const handleProceed = (event: React.MouseEvent<HTMLButtonElement>) => {
    // We don't want the enter key to submit our form
    event.preventDefault();

    let contentsStr = JSON.stringify(contents);

    if (downloadChecked) {
      handleDownload(contentsStr);
    } else if (githubChecked) {
      // HACK: Need to replace with Github Apps
      const { REACT_APP_GITHUB_PAT } = process.env;
      if (REACT_APP_GITHUB_PAT) {
        // Reset just the response message and set loading to true
        setResponse({
          loading: true,
          status: 0,
          message: ''
        });

        let contentsB64 = Buffer.from(contentsStr).toString('base64');
        uploadToGitHubViaApi(
          repoOwner,
          repoName,
          REACT_APP_GITHUB_PAT, // HACK: Need to replace with Github Apps
          contentsB64
        )
          .then((response) => {
            if (response.status) {
              setResponse({
                loading: false,
                status: response.status,
                message: `Your new template was successfully uploaded! Check it out at ${response.data.content.path} in your repo.`
              });
            } else {
              setResponse({
                loading: false,
                status: response.status,
                message: response.statusText
              });
            }
          })
          .catch((error) => {
            if (error instanceof AxiosError) {
              if (error.response) {
                if (error.response.status === 422) {
                  setResponse({
                    loading: false,
                    status: error.response.status,
                    message:
                      'This application currently does not support updating existing builds in a given repository'
                  });
                } else if (error.response.status === 404) {
                  setResponse({
                    loading: false,
                    status: error.response.status,
                    message:
                      'Are you sure that you have typed the repository name correctly?'
                  });
                } else {
                  setResponse({
                    loading: false,
                    status: error.response.status,
                    message: error.response.data.message
                  });
                }
              } else {
                setResponse({
                  loading: false,
                  status: 500,
                  message: 'An unknown error occured; Please check the logs.'
                });
              }
            } else {
              setResponse({
                loading: false,
                status: 500,
                message: 'An unknown error occured; Please check the logs.'
              });
            }
            console.log(error);
          });
      } else {
        setResponse({
          loading: false,
          status: 500,
          // HACK: Need to replace with Github Apps
          message:
            'Please ensure that a GitHub PAT is stored in the appropriate environment variable'
        });
      }
    }
  };

  return (
    <Modal isOpen={modal} toggle={toggleModal}>
      <ModalHeader toggle={toggleModal}>Next steps...</ModalHeader>
      <ModalBody>
        <Form>
          <FormGroup check>
            <Input
              name="download"
              type="checkbox"
              checked={downloadChecked}
              disabled={githubChecked ? true : false}
              onChange={(event) => handleInputChange(event)}
            />{' '}
            <Label check className="h6">
              Download file
            </Label>
            <br />
          </FormGroup>
          <FormGroup check>
            <Input
              name="upload-to-github"
              type="checkbox"
              checked={githubChecked}
              disabled={downloadChecked ? true : false}
              onChange={(event) => handleInputChange(event)}
            />{' '}
            <Label check className="h6">
              Upload to GitHub
            </Label>
            <br />
          </FormGroup>
          <FormGroup>
            <GitHubInputs
              visible={githubChecked}
              handleChange={handleInputChange}
              repoOwnerState={repoOwner}
              repoNameState={repoName}
            />
          </FormGroup>
        </Form>
        <ResponseMessage
          loadingFlag={response.loading}
          status={response.status}
          message={response.message}
          contents={JSON.stringify(contents)}
          downloadFile={handleDownload}
        />
      </ModalBody>
      <ModalFooter>
        <CustomButton
          color="primary"
          disabled={response.status === 201 ? true : false}
          onClick={(event: React.MouseEvent<HTMLButtonElement>) =>
            handleProceed(event)
          }
        >
          Proceed
        </CustomButton>
        <CustomButton color="secondary" onClick={handleClose}>
          {response.status === 201 ? 'Close' : 'Cancel'}
        </CustomButton>
      </ModalFooter>
    </Modal>
  );
};
