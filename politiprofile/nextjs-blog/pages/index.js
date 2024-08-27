import Head from 'next/head';
import Link from 'next/link';
import styles from '../styles/Home.module.css';
import Layout from '../components/layout';

export async function getStaticProps() {
  const allPostsData = getSortedPostsData();
  return {
    props: {
      allPostsData,
    },
  };
}
export default function Home() {
  return (
    <Layout home>
      <div className={styles.container}>
        <Head>
          <title>Create Next App</title>
          <link rel="icon" href="/favicon.ico" />
          <link href="./output.css" rel="stylesheet"></link>
        </Head>

        <main>

          <h1 className="text-3xl font-bold underline">
            Hello world!
          </h1>

          <h1 className={styles.title}>
            Read <Link href="/my-account">this page!</Link>
          </h1>
        </main>
      </div>
    </Layout>
  );
}
