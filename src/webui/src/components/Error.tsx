import React from 'react';
import { Alert } from 'reactstrap';

// ******************************************************************* //
// *** This file does not need to be edited for new projects ********* //
// ******************************************************************* //

interface ErrorMessageProps {
  debug: string;
  message: string;
}

export const ErrorMessage: React.FC<ErrorMessageProps> = (props) => {
  let debug = null;
  if (props.debug) {
    debug = (
      <pre className="alert-pre border bg-light p-2">
        <code>{props.debug}</code>
      </pre>
    );
  }
  return (
    <Alert color="danger">
      <p className="mb-3">{props.message}</p>
      {debug}
    </Alert>
  );
};
