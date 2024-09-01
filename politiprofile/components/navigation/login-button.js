// components/navigation/LoginButton.js
import * as React from 'react';
import Button from '@mui/material/Button';
import Link from 'next/link';
import styles from '../../styles/navigation/nav.module.css';

export default function LoginButton({ href = '/login', onClick }) {
  return (
    <Link href={href} passHref legacyBehavior>
      <Button
        className={styles.LoginButton}  // Apply specific styles here
        color="inherit"
        onClick={onClick}
      >
        Login
      </Button>
    </Link>
  );
}