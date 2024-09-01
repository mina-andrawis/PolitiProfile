import * as React from 'react';
import Button from '@mui/material/Button';
import Link from 'next/link';
import styles from "../../styles/navigation/nav.module.css";

export default function NavButton({ name, href = '/', onClick, sx, ariaLabel }) {
  return (
    <Link href={href} passHref legacyBehavior>
      <Button
        className={styles.NavButton}
        color="inherit"
        onClick={onClick}
        sx={sx}
        aria-label={ariaLabel || name}  // Provide accessibility support
      >
        {name}
      </Button>
    </Link>
  );
}