import {
  GettingOnTheSamePageFooter,
  ExampleComponentThatNeedsCurrentUserFooter,
  ExampleRTKQueryFooter,
  EnvironmentVariablesFooter
} from './Footers';
import { ExampleComponentWithBackButtonHandler } from './BackButtonHandler';
import { ExampleComponentThatNeedsCurrentUser } from './RetreiveCurrentUser';
import { ExampleOfUseEffectOnlyOnce } from './UseEffectInReact18';
import { ExampleComponentGettingDataFromContext } from './GetDataFromContext';
import { ExampleRTKQuery } from './ReduxToolkitQuery';

export const hardcodedExampleCarouselItems = [
  {
    name: 'Getting on the same page',
    body:
      'When a new project is spun up from this demo app template, all frontend developers ' +
      'that will be contributing to the project have the responsibility of familiarizing ' +
      'themselves with its contents and examples before beginning the project. Please allow ' +
      'all developers time to do so before merging changes to the files in this src/webui ' +
      'directory to the main branch of your clone of this template.',
    footer: <GettingOnTheSamePageFooter />,
    type: 'Ground Rule'
  },
  {
    name: 'Back Button Handler',
    body: <ExampleComponentWithBackButtonHandler />,
    footer: 'Check the console logs!',
    type: 'Tip'
  },
  {
    name: 'Retrieve the Current User',
    body: <ExampleComponentThatNeedsCurrentUser />,
    footer: <ExampleComponentThatNeedsCurrentUserFooter />,
    type: 'Tip'
  },
  {
    name: 'Redux Toolkit Query',
    body: <ExampleRTKQuery />,
    footer: <ExampleRTKQueryFooter />,
    type: 'Tip'
  },
  {
    name: 'Comment blocks',
    body:
      'Each file included in this demo app outside of the src/webui/src/components/examples ' +
      'directory has a comment block at the top. Please follow the pointers provided in each ' +
      'block for what content should and should not be changed to ensure that the app still ' +
      'works and that all calls to render example content are removed.',
    footer: '',
    type: 'Ground Rule'
  },
  {
    name: 'UseEffect() in React 18',
    body: <ExampleOfUseEffectOnlyOnce />,
    footer: 'Check the console logs!',
    type: 'Tip'
  },
  {
    name: 'Environment variables',
    body: <EnvironmentVariablesFooter />,
    footer: '',
    type: 'Tip'
  },
  {
    name: 'Get data out of the Context System',
    body: <ExampleComponentGettingDataFromContext />,
    footer:
      'Note that the Context System is not a replacement for an organized state store. ' +
      'Its most-fitting use cases are for app-wide visual details like theme colors, localities, etc.',
    type: 'Tip'
  },
  {
    name: 'Form example',
    body:
      'An example of a form with commonly-desired functionality is included within the ' +
      'AuthNavItem in src/webui/src/components/NavBar.tsx. It is an example of presenting ' +
      'a form from within a modal, where the onClick handler for the button that should render ' +
      'the form needs to exist alongside the local state of both the modal and the form.',
    footer: '',
    type: 'Tip'
  },
  {
    name: 'Custom types',
    body:
      'Please define any custom types that should be included in this app in the ' +
      'src/webui/src/types directory. This minimizes the risk of defining similar ' +
      'types for the same purpose dotted throughout the app. ',
    footer: '',
    type: 'Ground Rule'
  },
  {
    name: 'App metadata',
    body: "Don't forget to go into `src/webui/src/public` and update all metadata about this app",
    footer: '',
    type: 'Tip'
  },
  {
    name: 'Updating data in the state store',
    body:
      'The submitForm() function in src/webui/src/components/NavBar.tsx has an example of ' +
      'updating a slice of the Redux state store with the call to the updateRoles() action ' +
      'creator which was already bound to the dispatch(); function.',
    footer: 'More commentary is available in-line in the mentioned file',
    type: 'Tip'
  }
];
