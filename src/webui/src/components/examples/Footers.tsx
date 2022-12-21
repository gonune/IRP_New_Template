export const GettingOnTheSamePageFooter: React.FC = () => {
  return (
    <p>
      Check out <b>src/webui/CONTRIB.md</b> for general formatting and linting
      expectations as well
    </p>
  );
};

export const ExampleComponentThatNeedsCurrentUserFooter: React.FC = () => {
  return (
    <p>
      Please be sure to use the <b>currentUserSlice.ts</b> and <b>README.md</b>{' '}
      files in <b>src/webui/src/state</b> to template additions to the state
      store
    </p>
  );
};

export const ExampleRTKQueryFooter: React.FC = () => {
  return (
    <p>
      Check out the <b>store.ts</b> and <b>exampleCatalogItemsSlice.ts</b> files
      in <b>src/webui/src/state/</b> for more detailed commentary
    </p>
  );
};

export const EnvironmentVariablesFooter: React.FC = () => {
  return (
    <p>
      A recent change to how create-react-app uses environment variables
      requires that all environment variables are prefixed with
      <b>REACT_APP</b>; There is an example of this in <b>src/webui/src/.env</b>
    </p>
  );
};
