import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import NavButton from './nav-button';
import Button from '@mui/material/Button'; // Login button
import styles from '../../styles/navigation/nav.module.css'; // Ensure proper styles are imported
import LoginButton from './login-button';

export default function NavBar() {
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          {/* Left-aligned content */}
          <Box sx={{ display: 'flex', flexGrow: 1, alignItems: 'center' }}>
            <NavButton name="Home" href="/" />
            <NavButton name="About" href="/about" />
            <NavButton name="Compare Candidates" href="/compare-candidates" />
            <NavButton name="Education" href="/education" />
          </Box>
          <LoginButton href="/login"/>
        </Toolbar>
      </AppBar>
    </Box>
  );
}