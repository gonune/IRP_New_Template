import { Alert } from 'reactstrap';

export const SettingsPage: React.FC = () => {
  return (
    <Alert
      color="secondary"
      isOpen={true}
      style={{
        marginTop: 50,
        margin: 'auto',
        width: '70%'
      }}
    >
      <h1 className="text-center">Settings</h1>
    </Alert>
  );
};
