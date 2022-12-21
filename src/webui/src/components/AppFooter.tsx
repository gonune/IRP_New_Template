import React from 'react';

// ******************************************************************* //
// *** This file does not need to be edited for new projects ********* //
// ******************************************************************* //

// SAS copyright footer displayed on every view of our app
export const Footer: React.FC = () => {
  const today = new Date();

  return (
    // <div className="text-center" style={{ backgroundColor: '#e2e3e5' }}>
    <div className="text-center" style={{ paddingTop: 150 }}>
      ® {today.getFullYear()}, SAS Institute, Inc. (All Rights Reserved) Company
      Confidential
    </div>
  );
};
