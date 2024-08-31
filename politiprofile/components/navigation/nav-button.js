//create a navigation button component that will be used in the NavBar component
//import the necessary modules
import * as React from 'react';
import Button from '@mui/material/Button';

//create the NavButton component
export default function NavButton({name}) {
  return (
    <Button color="inherit">{name}</Button>
  );
}