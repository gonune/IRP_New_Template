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
  Spinner,
  CloseButton
} from 'reactstrap';
import { AxiosError } from 'axios';
import { Buffer } from 'buffer';

import { CustomButton } from '../genericHOCs/CustomButton';
import { uploadToGitHubViaApi } from '../../util/uploadToGitHub';
import { GitHubInputs } from './GitHubInputs';

interface ResultModalProps {
  modal: boolean;
  toggleModal: any;
  contents: any;
  operation: '' | 'new' | 'existing' | 'newFromExisting';
  clearFormInputs: Function;
}

interface ResponseMessageProps {
  loadingFlag: boolean;
  status: number;
  message: string;
  contents: string;
  downloadFile: Function;
  githubChecked: boolean;
}

interface DownloadLinkProps {
  responseStatus: number;
  contentsStr: string;
  downloadFile: Function;
  githubChecked: boolean;
}

const DownloadLink: React.FC<DownloadLinkProps> = ({
  responseStatus,
  contentsStr,
  downloadFile,
  githubChecked
}) => {
  if (responseStatus === 201 || (responseStatus === 200 && githubChecked)) {
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
  downloadFile,
  githubChecked
}) => {
  if (status === 0 && loadingFlag) {
    return <Spinner className="m-auto" color="primary" />;
  } else if (
    (status === 201 && message !== '') ||
    (status === 200 && message !== '')
  ) {
    return (
      <Alert color="primary">
        {message}
        <DownloadLink
          responseStatus={status}
          contentsStr={contents}
          downloadFile={downloadFile}
          githubChecked={githubChecked}
        />
      </Alert>
    );
  } else if (status === 201 && message === '') {
    return null;
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
  contents,
  operation,
  clearFormInputs
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

  const handleReset = () => {
    clearFormInputs();
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
    handleReset();
    toggleModal();
  };
  const handleDownload = (contentsStr: string) => {
    const blob = new Blob([contentsStr]);
    const element = document.createElement('a');
    element.href = URL.createObjectURL(blob);
    element.download = 'deploy-project.json';
    document.body.appendChild(element); // Required for this to work in FireFox
    element.click();
    setResponse((prevState) => ({ ...prevState, status: 201 }));
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
        // handleReset just the response message and set loading to true
        setResponse({
          loading: true,
          status: 0,
          message: ''
        });

        let contentsB64 = Buffer.from(contentsStr).toString('base64');
        let replaceExisting = false;

        if (operation === 'newFromExisting') {
          replaceExisting = true;
        }

        uploadToGitHubViaApi(
          repoOwner,
          repoName,
          REACT_APP_GITHUB_PAT, // HACK: Need to replace with Github Apps
          contentsB64,
          replaceExisting
        )
          .then((response: any) => {
            if (response.status) {
              setResponse({
                loading: false,
                status: response.status,
                message: `Your new template was successfully uploaded! Check it out at "${response.data.content.path}" in your repo.`
              });
            } else {
              setResponse({
                loading: false,
                status: response.status,
                message: response.statusText
              });
            }
          })
          .catch((error: any) => {
            if (error instanceof AxiosError) {
              if (error.response) {
                if (operation === 'new' && error.response.status === 422) {
                  setResponse({
                    loading: false,
                    status: error.response.status,
                    message:
                      'There is already a build template uploaded to that repository. You can copy its ' +
                      'contents from `.github/build/deploy-json.yml` from your reposity and paste them ' +
                      'into this app using the "Start from an existing template" button on the next screen.'
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
    // backdrop="static" makes it so the user can't click outside of the modal
    <Modal isOpen={modal} toggle={toggleModal} backdrop="static">
      <ModalHeader
        toggle={toggleModal}
        close={<CloseButton onClick={handleClose} />}
      >
        Next steps...
      </ModalHeader>
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
          githubChecked={githubChecked}
        />
      </ModalBody>
      <ModalFooter>
        <CustomButton
          color="primary"
          disabled={
            response.status === 201 || response.status === 200 ? true : false
          }
          onClick={(event: React.MouseEvent<HTMLButtonElement>) =>
            handleProceed(event)
          }
        >
          Proceed
        </CustomButton>
        <CustomButton color="secondary" onClick={handleClose}>
          {response.status === 201 || response.status === 200
            ? 'Close'
            : 'Cancel'}
        </CustomButton>
      </ModalFooter>
    </Modal>
  );
};
