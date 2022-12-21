import { Component } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
// Component library for this project
// https://reactstrap.github.io/?path=/docs
import { Container } from 'reactstrap';
import { Provider } from 'react-redux';

import withAuthProvider, {
  AuthComponentProps
} from './authentication/AuthProvider';
import { store } from './state/store';
import { RequireAuth } from './components/Authorization';
import { Navigation } from './components/NavBar';
import { ErrorMessage } from './components/Error';
import { WelcomePage } from './pages/WelcomePage';
import { Footer } from './components/AppFooter';
import { UnauthorizedPage } from './pages/UnauthorizedPage';
import { ExamplePage } from './components/examples/ExamplePage';
import { ExampleAuthInfoPage } from './components/examples/AuthInfoPage';
import { ProtectedPage } from './components/examples/ProtectedPage';
import { NewTemplatePage } from './pages/NewTemplatePage';
import { ListTemplatesPage } from './pages/ListTemplatesPage';
import { SettingsPage } from './pages/SettingsPage';

// ******************************************************************* //
// *** The only edits that need to be made to this file are to add *** //
// *** the routes that should exist for this application in the App ** //
// *** component's <Routes> element below. There are comments in-line  //
// *** describing how to protect routes based on the roles assigned ** //
// *** to the logged-in user via Azure Active Directory and detailed * //
// *** documentation is provided on the Auth'n & Auth'z tab of the app //
// ******************************************************************* //

class App extends Component<AuthComponentProps> {
  render() {
    let error = null;
    if (this.props.error) {
      error = (
        <ErrorMessage
          message={this.props.error.message}
          debug={this.props.error.debug}
        />
      );
    }

    return (
      // Wrap our app with the Redux store
      <Provider store={store}>
        <BrowserRouter>
          <Container
            fluid
            style={{
              width: '100%',
              paddingLeft: 100,
              paddingRight: 100,
              paddingTop: 30,
              paddingBottom: 30
            }}
          >
            <Navigation
              isAuthenticated={this.props.isAuthenticated}
              authButtonMethod={
                this.props.isAuthenticated
                  ? this.props.logout
                  : this.props.login
              }
              user={this.props.user}
            />

            {error}
            <Routes>
              <Route
                path="/"
                element={
                  <WelcomePage
                    isAuthenticated={this.props.isAuthenticated}
                    user={this.props.user}
                    authButtonMethod={this.props.login}
                  />
                }
              />
              <Route path="/unauthorized" element={<UnauthorizedPage />} />
              {/*** BEGIN - SECTION TO BE EDITED FOR EACH NEW PROJECT ***/}
              <Route path="/newTemplate" element={<NewTemplatePage />} />
              <Route path="/templates" element={<ListTemplatesPage />} />
              {/* We are wrapping route(s) with this route which renders an instance of the */}
              {/* RequireAuth component. That component takes an array of roles that the user */}
              {/* must have associated to them in order to view the elements rendered by the */}
              {/* wrapped routes. More commentary is included in the RequireAuth component */}
              <Route element={<RequireAuth allowedRoles={['Admin']} />}>
                <Route path="/settings" element={<SettingsPage />} />
              </Route>
              {/*** END - SECTION TO BE EDITED FOR EACH NEW PROJECT ***/}
            </Routes>
            <Footer />
          </Container>
        </BrowserRouter>
      </Provider>
    );
  }
}

// Hook our app up to Azure Active Directory
export default withAuthProvider(App);
