import React, { useEffect, useRef, useState } from 'react';

export const ExampleOfUseEffectOnlyOnce: React.FC = () => {
  // Prior to React 18, useEffect(() => {<code>}, []); would only run once
  // because passing an empty array means "Only run this effect on update
  // if the pieces of local state in this array change." BUT with React 18,
  // All components now mount, immediately unmount, and then mount again
  // so this piece of code WOULD run twice which is not the desired behavior
  // in our case (don't want to fetch data twice). As a workaround, we will
  // use a Ref to force React to only run this bit of code on the INITIAL mount
  // and not on the immediate re-mount that it does in version 18.
  // More information on this: https://www.youtube.com/watch?v=81faZzp18NM
  const effectRan = useRef(false);
  useEffect(() => {
    if (effectRan.current === false) {
      console.log('Effect ran');

      return () => {
        effectRan.current = true;
      };
    }
  });

  return (
    <p>
      This is an example of a component that needs to ensure that some logic
      only executes the very first time that it renders. This used to be
      acheived by passing an empty dependency array argument to the useEffect
      hook, but there were some critical changes made in React 18 that require
      an extra step to acheive the same behavior. There are additional notes in
      the definition of this component.
    </p>
  );
};
