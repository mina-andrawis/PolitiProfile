import * as React from 'react';
import dynamic from 'next/dynamic';  // Add dynamic import
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import NavButton from './nav-button';


export default function NavBar() {
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2 }}
          >
          </IconButton>
          <Typography variant="h5" component="div" sx={{ flexGrow: 1 }}>
            Home
          </Typography>
          <Button color="inherit"> Login</Button>
        </Toolbar>
      </AppBar>
    </Box>
  );
}