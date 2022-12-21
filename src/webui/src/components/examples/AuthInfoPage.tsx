import { Alert } from 'reactstrap';

export const ExampleAuthInfoPage: React.FC = () => {
  return (
    <Alert color="secondary" isOpen={true} style={{ margin: 20, fontSize: 20 }}>
      <h2>This app's authentication setup</h2>
      <p>
        Critical to implementing protected routes in this app is first having
        authentication set up so we know who our users are. You may have noticed
        that you needed to sign in with Azure Active Directory (AAD) before you
        could use this demo app. This allows us to save information about your
        AAD identity, including the roles assigned to you, in our state store.
        Before we get to that though, let's outline the steps we took to hook
        this application into AAD.{' '}
        <b>
          You will need to follow these steps to re-configure this project for
          your use; it should not continue to use the demo app registration
          details.
        </b>
      </p>
      <ol>
        <li>
          Create a{' '}
          <a
            href="https://portal.azure.com/#view/Microsoft_AAD_IAM/ActiveDirectoryMenuBlade/~/RegisteredApps"
            target="_blank"
          >
            new Application Registration
          </a>{' '}
          with basic settings and a name that associates it to your project
          (skip the redirect settings for now)
        </li>
        <li>
          On the <b>API Permissions</b> blade, add the following from the
          Microsoft Graph section, selecting "Delegated Permissions" for each:
          email, openid, profile, User.Read
        </li>
        <li>
          Get all of those permissions approved by SAS IT with{' '}
          <a
            href="https://sas.service-now.com/sp?id=sc_cat_item&sys_id=e7283f38db4a18d0f7a44b491396190a"
            target="_blank"
          >
            a new ticket from this template
          </a>
          . Note that your App Registration will not work properly until this
          ticket has been approved and completed by SAS IT.
          <ul>
            <li>
              Type "Graph API + Client credentials grant type for the question
              about which grant types you want to use
            </li>
            <li>
              Select "No" for the question about special delegated API
              permissions
            </li>
            <li>Select "No" for the question about application permissions</li>
          </ul>
        </li>
        <li>
          On the <b>Authentication</b> blade, click the button to{' '}
          <b>Add a platform</b>, select <b>Single-page application</b>, and then
          add redirect URI(s). Before you click <b>Configure</b>, make sure to
          check both the "Access tokens" and the "ID tokens" boxes.
          <ul>
            <li>
              Note that This demo app expects just <b>http://localhost:3000</b>{' '}
              for development but after you deploy your app you will need to add
              another entry replacing <b>localhost</b> with the URL of your
              deployed app.
            </li>
            <li>
              You can also add redirect URIs for all other ports between
              3000-3009 if you expect that you'll be running multiple
              development ReactJS apps at the same time.
            </li>
          </ul>
        </li>
        <li>
          Update the value of the REACT_APP_AAD_CLIENT_ID environment variable
          in <b>src/webui/src/config.ts</b> to point to the Client ID of your
          new app registration
        </li>
        <li>
          Check out the files in the <b>src/webui/src/authentication</b>{' '}
          directory and the <b>src/webui/src/App.tsx</b> file to see the code
        </li>
      </ol>
      <p>
        You can view the App Registration configured for this demo app{' '}
        <a
          href="https://portal.azure.com/#view/Microsoft_AAD_RegisteredApps/ApplicationMenuBlade/~/Overview/quickStartType~/null/sourceType/Microsoft_AAD_IAM/appId/a1f7fae3-31f3-4a77-a9a5-6efdc1661c64/objectId/f7f39290-2fe1-4c24-88ce-5cd122693615/isMSAApp~/false"
          target="_blank"
        >
          here
        </a>
        .
      </p>
      <br />
      <h2>This app's authorization setup</h2>
      <p>
        Now that we understand the authentication setup, we can take a look at
        how role-based access control (RBAC) rules are defined on some routes in
        this app.{' '}
        <b>
          You will need to follow these steps to re-configure this project for
          your use; it should not continue to use the demo app registration
          details.
        </b>
      </p>
      <ol>
        <li>
          We start by creating a <b>route</b> that we want to protect and
          optionally create a tab in the app's navigation bar for it. For this
          example, we have added the following route to the <b>Routes</b>{' '}
          element in <b>src/webui/src/App.tsx</b>:{' '}
          <pre>{`<Route path="/protected" element={<ProtectedPage />} />`}</pre>
          And we have created the "Auth'n & Auth'z" tab in the navigation bar
          that points to this route by adding the following entry to the{' '}
          <b>tabInfo</b> object defined in{' '}
          <b>src/webui/src/components/NavBar.tsx</b>:
          <pre>{`{ name: "Auth'n & Auth'z", path: '/authInfo' }`}</pre>
          <br />
        </li>
        <li>
          Then we wrap the <b>Route</b> element we want to create RBAC rules for
          with another Route element, this one rendering our custom{' '}
          <b>RequireAuth</b> component and passing a value of a list of names of
          roles to the <b>allowedRoles</b> prop:
          <pre>
            {`<Route element={<RequireAuth allowedRoles={['Admin']} />}>`}
            <br />
            {`  <Route path="/protected" element={<ProtectedPage />} />`}
            <br />
            {`</Route>`}
          </pre>
          This indicates to react-router-dom that we want users to have the{' '}
          <b>Admin</b> role assigned to them in order to view the routes that
          are wrapped, in our case just <b>/protected</b> but you could put any
          number of Route elements in the wrapper.
          <br />
          <br />
        </li>
        <li>
          Where did that 'Admin' role come from? If you navigate back to the{' '}
          <b>App Registration</b> you created in the Authentication section
          above and then go into the <b>App Roles</b> blade, you can define
          custom roles there. For this demo app we have created a role named
          'Admins' with a value of 'Admin'. Any users that are given that role
          will now have that value in their list of roles returned from AAD when
          we log them in.
          <br />
          <br />
        </li>
        <li>
          How do users get this role assigned to them? When we created the{' '}
          <b>App Registration</b> in the Authentication section above, an{' '}
          <b>Enterprise Application</b> was also created for us. The easiest way
          to find it is to use the portal to navigate to the{' '}
          <b>Azure Active Directory</b> service and then into the{' '}
          <b>Enterprise Applications</b> blade and search for the name you gave
          your <b>App Registration</b>.
          <ol>
            <li>
              Once you find it, click the card on the <b>Overview</b> blade
              that's titled <b>1. Assign users and groups</b>
            </li>
            <li>
              Then click on the <b>Add user/group</b> button and follow the
              prompts to search for the user you want to add (in this case
              that's yourself but in the real world this would be actual
              expected users of the app) and to select the role you want to
              assign to them. These roles came from the earlier step where we
              defined them on the <b>Application Registration</b>. Note that you
              can only assign one role at a time but you can repeat this step,
              selecting the same identity again but a different role.
            </li>
          </ol>
          <br />
        </li>
      </ol>
      <p>
        Now when users navigate to the 'Protected' tab which sends them to this
        route, if they do not have the 'Admin' role assigned to them then they
        will be presented with an "Unauthorized" page, otherwise they will see
        the content as intended. You can take a look at the{' '}
        <b>Enterprise Application</b> that was configured for this demo app{' '}
        <a
          href="https://portal.azure.com/#view/Microsoft_AAD_IAM/ManagedAppMenuBlade/~/Overview/objectId/7565a67c-e06b-40d2-9da9-dc979fdcad68/appId/a1f7fae3-31f3-4a77-a9a5-6efdc1661c64/preferredSingleSignOnMode~/null"
          target="_blank"
        >
          here
        </a>
        . You might also want to check out the code in{' '}
        <b>src/webui/src/components/Authorization.tsx</b> and{' '}
        <a href="https://www.youtube.com/watch?v=oUZjO00NkhY" target="_blank">
          this YouTube video on Protected Routes
        </a>
        .
      </p>
      <br />
      <h2>This app's role selection overrides</h2>
      <p>
        Some functionality to manually override how this app perceives the
        logged-in user's roles is included and accessible via the dropdown by
        the profile icon. Note that this functionality is provided to help us
        during demonstrations <b>only</b>, so that we can show how the
        application changes based on the user's roles faster than having to make
        changes to our AAD identities. To demonstrate how this works:
        <ol>
          <li>
            Click then pen icon next to "Current roles" in the user profile
            dropdown
          </li>
          <li>Select the "Admin" option and then click "Submit"</li>
          <li>
            Navigate to the tab called <b>Protected</b> and validate that you do
            not get an unauthorized error
          </li>
          <li>
            Go back to the pen icon and this time submit without selecting
            "Admin"
          </li>
          <li>
            If you do this while still on the <b>Protected</b> tab, it will
            automatically re-direct you to the <b>/unauthorized</b> page.
            Otherwise, you can attempt to navigate directly to the{' '}
            <b>Protected</b> tab and verify that you get re-directed to the{' '}
            <b>/unauthorized</b> page.
          </li>
        </ol>
        There are instructions in the comment section at the top of the{' '}
        <b>src/webui/src/components/NavBar.tsx</b> file on how to make the
        available selections match the role values that you defined on the App
        Registration for your app in the Authorization section above.
      </p>
    </Alert>
  );
};
