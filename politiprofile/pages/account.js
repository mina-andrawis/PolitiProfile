// src/pages/account.js

import React, { useEffect } from "react";
import { useRouter } from "next/router";
import useAuth from "../hooks/useAuth"; // Assuming useAuth is handling user authentication
import LoginWrapper from "../components/login-register/login-wrapper";
import Layout from "../components/layout";
import Head from "next/head";

const Account = () => {
  const { user, logout, loading } = useAuth(); // Get the current user and logout function
  const router = useRouter();

  // Redirect to login page if not authenticated
  useEffect(() => {
    if (!loading && !user) {
        <LoginWrapper/>
    }
  }, [loading, user, router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <Layout>
      <Head>
        <title>My Account</title>
      </Head>
      <div className="mx-auto w-full p-6 text-center">
        <h1 className="mb-4 text-4xl font-bold">My Account</h1>
        
        <button className="p-2 bg-red-500 text-white rounded-md hover:bg-red-600"
        onClick={logout}
        >
            Log Out
        </button>
      </div>
    </Layout>
  );
};

export default Account;
