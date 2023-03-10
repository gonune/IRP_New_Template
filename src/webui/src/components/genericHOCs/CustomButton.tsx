import React, { ReactNode, useContext } from 'react';
import { Button } from 'reactstrap';

import { ThemeColorsContext } from '../../context/themeColors';

// ******************************************************************* //
// *** This file does not need to be edited for new projects ********* //
// ******************************************************************* //

interface CustomButtonProps {
  color: 'primary' | 'secondary' | 'info' | 'danger' | 'link';
  onClick?: any;
  className?: string;
  outline?: boolean;
  id?: string;
  active?: boolean;
  children?: ReactNode;
  disabled?: boolean;
  style?: any;
}

export const CustomButton: React.FC<CustomButtonProps> = (props) => {
  const { primary, secondary, info, danger } = useContext(ThemeColorsContext);
  if (props.color === 'link') {
    return (
      <Button
        style={props.style}
        color="link"
        id={props.id}
        onClick={props.onClick}
        className={props.className}
        disabled={props.disabled}
      >
        {props.children}
      </Button>
    );
  }

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

  let style: any = {};

  if (!props.outline || (props.outline && props.active)) {
    style = { background: color };
  } else {
    style = {
      background: 'white',
      borderInlineColor: color,
      color: color
    };
  }

  if (props.style) {
    for (const [key, value] of Object.entries(props.style)) {
      style[`${key}`] = value;
    }
  }

  return (
    <Button
      style={style}
      id={props.id}
      onClick={props.onClick}
      className={props.className}
      disabled={props.disabled}
    >
      {props.children}
    </Button>
  );
};
