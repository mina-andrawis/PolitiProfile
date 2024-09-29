import Link from "next/link";
import Head from "next/head";
import Script from "next/script";
import Layout from "../components/layout";

export default function MyAccount() {
  return (
    <Layout>
      <Head>
        <title>My Accountie</title>
      </Head>
      <h1>My Account</h1>
      <h2>
        <Link href="/">Home</Link>
      </h2>
    </Layout>
  );
}
