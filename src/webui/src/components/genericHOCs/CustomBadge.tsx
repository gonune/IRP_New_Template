import React, { ReactNode, useContext } from 'react';

import { ThemeColorsContext } from '../../context/themeColors';

// ******************************************************************* //
// *** This file does not need to be edited for new projects ********* //
// ******************************************************************* //

interface CustomBadgeProps {
  color: 'primary' | 'secondary' | 'info' | 'danger';
  className?: string;
  children?: ReactNode;
}

export const CustomBadge: React.FC<CustomBadgeProps> = (props) => {
  const { primary, secondary, info, danger } = useContext(ThemeColorsContext);

  let color = '';

  if (props.color === 'primary') {
    color = primary;
  } else if (props.color === 'secondary') {
    color = secondary;
  } else if (props.color === 'info') {
    color = info;
  } else if (props.color === 'danger') {
    color = danger;
  }

  return (
    <div
      style={{
        background: color,
        color: 'white',
        borderRadius: 3,
        paddingLeft: 5,
        paddingRight: 5,
        paddingBottom: 2,
        width: 'fit-content'
      }}
      className={props.className}
    >
      <b>{props.children}</b>
    </div>
  );
};
