import React, { useState } from 'react';
import { NavLink as RouterNavLink } from 'react-router-dom';
import {
  Row,
  Col,
  Dropdown,
  Navbar,
  NavbarBrand,
  Nav,
  NavItem,
  DropdownMenu,
  DropdownToggle,
  DropdownItem,
  Tooltip,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Form,
  FormGroup,
  Input,
  Label
} from 'reactstrap';
import '@fortawesome/fontawesome-free/css/all.css'; // For icons

import { CustomButton } from './genericHOCs/CustomButton';
import { useCurrentUserActions } from '../hooks/useActions';
import { useCurrentUserIs } from '../hooks/useSelectors';

// ******************************************************************* //
// *** The only edits that need to be made to this file are to add *** //
// *** the tabs that should be rendered after the user logs in to **** //
// *** the tabInfo list on line 50 below and to define the roles for * //
// *** this application by editing the FormGroup on lines 229-241. *** //
// *** Note that you can add more FormGroup elements like it to define //
// *** additional roles for the application. In each case, ensure that //
// *** both the 'name' (ex. line 232) and Label text (ex. line 237) ** //
// *** match the VALUE you gave to the role when defining it in the ** //
// *** App Registration ********************************************** //
// ******************************************************************* //

interface NavBarProps {
  isAuthenticated: boolean;
  authButtonMethod: any;
  user: any;
}

interface TabInfo {
  name: string;
  path: string;
}

function renderTabs(props: NavBarProps) {
  // For each tab you include, ensure that you define a route for it in
  // the ../App.tsx file's <Routes> element
  const tabInfo: TabInfo[] = [
    { name: 'New Template', path: '/newTemplate' },
    { name: 'View Templates', path: '/templates' },
    { name: 'Settings', path: '/settings' },
    { name: 'Example Page', path: '/examplePage' }
  ];

  if (props.isAuthenticated) {
    return tabInfo.map((tab: TabInfo) => {
      return (
        <NavItem key={tab.name}>
          <RouterNavLink key={tab.name} className="nav-link" to={tab.path}>
            {tab.name}
          </RouterNavLink>
        </NavItem>
      );
    });
  } else {
    return null;
  }
}

// A profile icon for the user
function UserAvatar(props: any) {
  // if a user avatar is available, return an img tag with the pic
  if (props.user.avatar) {
    return (
      <img
        src={props.user.avatar}
        alt="user"
        className="rounded-circle align-self-center mr-2"
        style={{ width: '32px' }}
      ></img>
    );
  }
  // No avatar available, return a default icon
  return (
    <i
      className="far fa-user-circle fa-lg rounded-circle mr-2"
      style={{ width: '32px' }}
    ></i>
  );
}

const SelectedRoleText: React.FC = () => {
  // Get the currentUser out of Redux state with the custom hook which
  // wraps the built-in useSelector hook to give us only the slice of
  // state that we're looking for
  const { currentUser } = useCurrentUserIs();
  const roles = currentUser.roles;

  function renderText() {
    if (roles.length === 0) {
      return (
        <div>
          <em>None</em>
        </div>
      );
    } else {
      return roles.map((role) => {
        return (
          <div>
            {role}
            <br />
          </div>
        );
      });
    }
  }

  return <p className="dropdown-item-text text-muted mb-0">{renderText()}</p>;
};

// User info in a dropdown from the profile icon; only shown if authenticated
// Includes info about the user's roles from AAD and an override to them for demo purposes
function AuthNavItem(props: NavBarProps) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const toggleDropdown = () => setDropdownOpen((prevState) => !prevState);
  const [tooltipOpen, setTooltipOpen] = useState(false);
  const toggleTooltip = () => setTooltipOpen(!tooltipOpen);
  const [modal, setModal] = useState(false);
  const toggleModal = () => setModal(!modal);
  const [roleSelections, setRoleSelections] = useState<string[]>([]);

  // Destructure out the action creators for this slice of the state store, already
  // bound to React-Redux's dispatch() function
  const { updateRoles, unsetUser } = useCurrentUserActions();

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { target } = event;
    const { name } = target;

    setRoleSelections([...roleSelections, name]);
  };

  const submitForm = (event: React.MouseEvent<HTMLButtonElement>) => {
    // Prevents the submit button from refreshing the page
    event.preventDefault();
    // Update the user's roles in the state store
    updateRoles(roleSelections);
    // Make sure the tooltip gets shut
    setTooltipOpen(false);
    toggleModal();
  };

  const handleSignOut = () => {
    props.authButtonMethod();
    unsetUser();
  };

  const handleSelectRoles = () => {
    setRoleSelections([]);
    toggleDropdown();
    setTooltipOpen(false);
    toggleModal();
  };

  if (props.isAuthenticated) {
    return (
      <div className="ms-auto">
        <Dropdown
          isOpen={dropdownOpen}
          toggle={toggleDropdown}
          direction="start"
        >
          <DropdownToggle caret>
            <UserAvatar user={props.user} />
          </DropdownToggle>
          <DropdownMenu>
            <h5 className="dropdown-item-text mb-0">
              {props.user.displayName}
            </h5>
            <p className="dropdown-item-text text-muted mb-0">
              {props.user.email}
            </p>
            <DropdownItem divider />
            <Row>
              <Col xs="auto" className="pe-0">
                <h5 className="dropdown-item-text mb-0">Current roles</h5>
              </Col>
              <Col className="ps-0">
                <CustomButton
                  id="needsSwitchRoleTooltip"
                  color="link"
                  className="p-0 me-2"
                  onClick={handleSelectRoles}
                >
                  <i className="fa-solid fa-pen"></i>
                </CustomButton>
                <Tooltip
                  isOpen={tooltipOpen}
                  target="needsSwitchRoleTooltip"
                  toggle={toggleTooltip}
                >
                  Select a different set of roles (prototype demonstration
                  purposes only)
                </Tooltip>
                <Modal isOpen={modal} toggle={toggleModal}>
                  <ModalHeader toggle={toggleModal}>
                    Select roles to apply
                  </ModalHeader>
                  <ModalBody>
                    <h5>* For prototype demonstration purposes only!</h5>
                    <br />
                    <Form>
                      <FormGroup tag="fieldset">
                        <FormGroup check>
                          <Input
                            name="Admin"
                            type="checkbox"
                            onChange={(event) => handleInputChange(event)}
                          />{' '}
                          <Label check className="h6">
                            Admin
                          </Label>
                          <br />
                        </FormGroup>
                      </FormGroup>
                    </Form>
                  </ModalBody>
                  <ModalFooter>
                    {/* Only actually call the function to make the call to the */}
                    {/* business service once they've confirmed */}
                    <CustomButton
                      color="primary"
                      onClick={(event: React.MouseEvent<HTMLButtonElement>) =>
                        submitForm(event)
                      }
                    >
                      Submit
                    </CustomButton>
                    <CustomButton color="secondary" onClick={toggleModal}>
                      Cancel
                    </CustomButton>
                  </ModalFooter>
                </Modal>
              </Col>
            </Row>
            <SelectedRoleText />
            <DropdownItem divider />
            <DropdownItem onClick={handleSignOut}>Sign Out</DropdownItem>
          </DropdownMenu>
        </Dropdown>
      </div>
    );
  }

  return <div></div>;
}

// Main navigation bar at the top
export const Navigation: React.FC<NavBarProps> = (props) => {
  return (
    <div style={{ paddingBottom: 20 }}>
      <Navbar
        color="light"
        light
        expand="sm"
        style={{ position: 'sticky', top: 0 }}
      >
        <NavbarBrand href="/">
          <img src="sas-logo-midnight.png" height={40} alt={'SAS Logo'} />
        </NavbarBrand>
        <Nav tabs className="container-fluid" navbar>
          <NavItem>
            <RouterNavLink className="nav-link" to="/">
              Home
            </RouterNavLink>
          </NavItem>
          {renderTabs(props)}
          <AuthNavItem
            isAuthenticated={props.isAuthenticated}
            authButtonMethod={props.authButtonMethod}
            user={props.user}
          />
        </Nav>
      </Navbar>
    </div>
  );
};
