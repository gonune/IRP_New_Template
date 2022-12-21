import { useCurrentUserIs } from '../../hooks/useSelectors';

export const ExampleComponentThatNeedsCurrentUser: React.FC = () => {
  const { currentUser } = useCurrentUserIs();
  return (
    <p>
      This is an example of a component that needs to be able to access the
      details about the current user of the application. When users sign into
      this app, the information that's returned from Azure Active Directory gets
      stored in a slice of the Redux state store. That information can then be
      retreived by the components in this app because we wrapped App.js in the
      Redux store.
      <br />
      <br />
      <b>{JSON.stringify(currentUser.user_principal_name, null, 2)}</b>
    </p>
  );
};
