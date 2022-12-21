import { Alert } from 'reactstrap';

export const UnauthorizedPage: React.FC = () => {
  return (
    <Alert className="text-center" color="danger" isOpen={true}>
      <h1>404: Unauthorized</h1>
      <br />
      <h4>
        You do not have the role(s) neccessary to view the page that you
        requested.
      </h4>
    </Alert>
  );
};
