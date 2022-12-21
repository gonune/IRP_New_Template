import React from 'react';
import { Logger, LogLevel, UserAgentApplication } from 'msal';
import { getUserDetails } from './AADGraphService';

import { config } from '../config';
import { User } from '../types/User';

// ******************************************************************* //
// *** This file does not need to be edited for new projects ********* //
// ******************************************************************* //

const logger = new Logger(
  (logLevel, message, containsPii) => {
    console.log('[MSAL]', message);
  },
  {
    level: LogLevel.Warning,
    piiLoggingEnabled: false
  }
);

export interface AuthComponentProps {
  error: any;
  isAuthenticated: boolean;
  user: User;
  login: Function;
  logout: Function;
  getAccessToken: Function;
  setError: Function;
}

interface AuthProviderState {
  error: any;
  isAuthenticated: boolean;
  user: any;
  idToken: any;
}

export default function withAuthProvider<
  T extends React.Component<AuthComponentProps>
>(
  WrappedComponent: new (props: AuthComponentProps, context?: any) => T
): React.ComponentClass {
  return class extends React.Component<any, AuthProviderState> {
    private userAgentApplication: UserAgentApplication;

    constructor(props: any) {
      super(props);
      this.state = {
        error: null,
        isAuthenticated: false,
        user: {},
        idToken: null
      };

      // Initialize the MSAL application object
      this.userAgentApplication = new UserAgentApplication({
        auth: {
          clientId: config.appId,
          authority: config.authority,
          redirectUri: config.redirectUri,
          postLogoutRedirectUri: config.postLogoutRedirectUri
        },
        system: {
          logger: logger as any
        },
        cache: {
          cacheLocation: 'sessionStorage',
          storeAuthStateInCookie: true
        }
      });
    }

    componentDidMount() {
      // If MSAL already has an account, the user
      // is already logged in
      var account = this.userAgentApplication.getAccount();

      if (account) {
        // Enhance user object with data from Graph
        this.getUserProfile();
      }
    }

    render() {
      return (
        <WrappedComponent
          login={() => this.login()}
          logout={() => this.logout()}
          getAccessToken={(scopes: string[]) => this.getAccessToken(scopes)}
          setError={(message: string, debug: string) =>
            this.setErrorMessage(message, debug)
          }
          {...this.props}
          {...this.state}
        />
      );
    }

    async login() {
      try {
        // Login via popup
        await this.userAgentApplication.loginPopup({
          scopes: config.scopes,
          prompt: 'select_account'
        });
        // After login, get the user's profile
        await this.getUserProfile();
      } catch (err) {
        this.setState({
          isAuthenticated: false,
          user: {},
          error: this.normalizeError(err)
        });
      }
    }

    logout() {
      this.userAgentApplication.logout();
    }

    async getAccessToken(scopes: string[]): Promise<any> {
      try {
        // Get the access token silently
        // If the cache contains a non-expired token, this function
        // will just return the cached token. Otherwise, it will
        // make a request to the Azure OAuth endpoint to get a token
        var silentResult = await this.userAgentApplication.acquireTokenSilent({
          scopes: scopes
        });
        return {
          accessToken: silentResult.accessToken,
          idToken: silentResult.idToken,
          roles: silentResult.idToken.claims.roles
        };
      } catch (err) {
        // If a silent request fails, it may be because the user needs
        // to login or grant consent to one or more of the requested scopes
        if (this.isInteractionRequired(err)) {
          var interactiveResult =
            await this.userAgentApplication.acquireTokenPopup({
              scopes: scopes
            });
          return {
            accessToken: interactiveResult.accessToken,
            idToken: interactiveResult.idToken,
            roles: interactiveResult.idToken.claims.roles
          };
        } else {
          throw err;
        }
      }
    }

    async getUserProfile() {
      try {
        var { accessToken, idToken, roles } = await this.getAccessToken(
          config.scopes
        );

        if (accessToken) {
          // Get the user's profile from Graph
          var user = await getUserDetails(accessToken);
          this.setState({
            isAuthenticated: true,
            user: {
              displayName: user.displayName,
              givenName: user.givenName,
              surname: user.surname,
              id: user.id,
              jobTitle: user.jobTitle,
              userPrincipalName: user.userPrincipalName,
              email: user.mail || user.userPrincipalName,
              roles: roles,
              idToken: idToken
            },
            error: null
          });
        }
      } catch (err) {
        this.setState({
          isAuthenticated: false,
          user: {},
          error: this.normalizeError(err)
        });
      }
    }

    setErrorMessage(message: string, debug: string) {
      this.setState({
        error: { message: message, debug: debug }
      });
    }

    // normalizeError(error: string | Error): any {
    normalizeError(error: any): any {
      var normalizedError = {};
      if (typeof error === 'string') {
        var errParts = error.split('|');
        normalizedError =
          errParts.length > 1
            ? { message: errParts[1], debug: errParts[0] }
            : { message: error };
      } else {
        normalizedError = {
          message: error.message,
          debug: JSON.stringify(error)
        };
      }
      return normalizedError;
    }

    // isInteractionRequired(error: Error): boolean {
    isInteractionRequired(error: any): boolean {
      if (!error.message || error.message.length <= 0) {
        return false;
      }

      return (
        error.message.indexOf('consent_required') > -1 ||
        error.message.indexOf('interaction_required') > -1 ||
        error.message.indexOf('login_required') > -1
      );
    }
  };
}
