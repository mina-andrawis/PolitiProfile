import React from "react";
import NavBar from "../components/navigation/navbar";
import Layout from "../components/layout";
import Head from "next/head";

export default function About() {
  return (
    <Layout>
      <Head>
        <title>Your Topics</title>
      </Head>
      <div className="mx-auto w-full p-6 text-center">
        <h1 className="mb-4 text-4xl font-bold">Your Topics</h1>
        <p className="text-lg mb-3">
          We all have political topics that are important to us.  
        </p>
        <p className="text-lg">
          Here, you can select which topics you hold dear and see how the your representatives stack up on those issues.
        </p>
      </div>
    </Layout>
  );
}
