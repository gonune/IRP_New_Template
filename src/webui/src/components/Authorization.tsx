import { Outlet, useLocation, Navigate } from 'react-router-dom';
import { useCurrentUserIs } from '../hooks/useSelectors';

// ******************************************************************* //
// *** This file does not need to be edited for new projects ********* //
// ******************************************************************* //

// You must pass a list of roles that you want users to have assigned to them in order to view the
// contents at your route
interface RequireAuthProps {
  allowedRoles: string[];
}

export const RequireAuth: React.FC<RequireAuthProps> = ({ allowedRoles }) => {
  // Collect information about the currently logged-in user, including their list of roles from
  // Azure Active Directory, from our state store
  const { currentUser } = useCurrentUserIs();
  // Determine what page the user was on
  const location = useLocation();

  // Compare the user's roles with the allowed roles sent into this component via the allowedRoles prop
  // If the roles match, then return the "Outlet", which is all of the Routes that are wrapped by the
  // Route where we render this RequireAuth component; In other words, the user will be able to access them
  return currentUser.roles.find((role) => allowedRoles.includes(role)) ? (
    <Outlet />
  ) : // If the roles do not match, do we even have a user? If so then they need to be routed to
  // the unauthorized page
  currentUser.user_principal_name !== '' ? (
    <Navigate to="/unauthorized" state={{ from: location }} replace />
  ) : // Otherwise (we don't have a user), just do nothing
  null;
};
