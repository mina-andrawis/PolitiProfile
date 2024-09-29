import React from "react";
import NavBar from "../components/navigation/navbar";
import Layout from "../components/layout";
import Head from "next/head";

export default function About() {
  return (
    <Layout>
      <Head>
        <title>About PolitiProfile</title>
      </Head>
      <div className="mx-auto w-full p-6 text-center">
        <h1 className="mb-4 text-4xl font-bold">About</h1>
        <p className="text-lg leading-relaxed">
          PolitiProfile is a platform that allows users to connect with
          politicians and candidates that align with their ideals. Compare
          candidates for elections and discover insights on key political
          issues.
        </p>
      </div>
    </Layout>
  );
}
