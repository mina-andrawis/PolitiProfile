import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import styles from '../styles/layout.module.css';
import utilStyles from '../styles/utils.module.css';
import NavBar from './navigation/navbar';

const name = 'PolitiProfile';
export const siteTitle = 'PolitiProfile';

export default function Layout({ children, home }) {
  return (
    <div className={styles.container}>
      <Head>
        <meta
          name="description"
          content="Connect with politicians and candidates that align with your ideals. Compare candidates for elections and discover insights on key political issues."
        />
      </Head>
      <header className={styles.header}>
        <h1 className={utilStyles.heading2Xl}>{name}</h1>
      </header>
      <NavBar />
      <main>{children}</main>
      {!home && (
        <div className={styles.backToHome}>
          <Link href="/">← Back to home</Link>
        </div>
      )}
    </div>
  );
}