import React, { useContext } from 'react';

import { ExampleContext } from '../../context/exampleContext';
import { CustomButton } from '../HOCs/CustomButton';

export const ExampleComponentGettingDataFromContext: React.FC = () => {
  // Destructure the properties that we want from the context object(s)
  const { count, incrementCount } = useContext(ExampleContext);

  return (
    <div>
      <p>
        In this example we're getting items out of the Context System which
        wraps every component in this application. Note that the Context System
        is also providing the CustomButton components in this app with
        SAS-branded theme colors. There is a "count" value stored in the
        "ExampleContext" and its value is: <b>{count}</b>
      </p>
      <br />
      <CustomButton color="secondary" onClick={incrementCount} outline={true}>
        Click to try updating its value
      </CustomButton>
    </div>
  );
};
