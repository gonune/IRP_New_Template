import { useBackButtonListener } from '../../hooks/useBackButtonListener';

export const ExampleComponentWithBackButtonHandler: React.FC = () => {
  const customBackButtonHandler = () => {
    console.log('User pressed the back button!');
  };

  useBackButtonListener(customBackButtonHandler);

  return (
    <p>
      This is an example of a component that utilizes the custom hook in this
      project which registers a listener for if/when the user clicks their
      browser's back button. That hook can be passed a callback function
      dictating what to do if the back button was pressed, which in this case
      just issues a statement to the console logs.
    </p>
  );
};
