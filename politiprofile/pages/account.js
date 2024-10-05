import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import useAuth from "../hooks/useAuth"; // Assuming useAuth is handling user authentication
import LoginWrapper from "../components/login-register/login-wrapper";
import Layout from "../components/layout";
import Head from "next/head";
import useAuthState from "../hooks/useAuthState";
import AccountContent from "../components/account-selection";
import AccountSelection from "../components/account-selection";

const Account = () => {
  const [accountSelection, setAccountSelection] = useState('profile-information');

  const { logout, loading } = useAuth(); // Get the current user and logout function
  const { user } = useAuthState(); // Get the current user

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  useEffect(() => {
    console.log(user);
  }, [accountSelection]);

  return (
    <Layout>
      <Head>
        <title>My Account</title>
      </Head>
      <div className="mx-auto w-full p-6 text-left">
        <h1 className="mb-4 text-4xl font-bold">My Account</h1>

        {user ? (
          <div className="flex">
            <div className="w-1/5 py-4 pr-4 min-w-fit">
              <p className="mb-4">Welcome, {user.email}</p>

              <button
                className="p-2 mb-3 w-full bg-secondary text-white rounded-md hover:bg-blue-600"
                onClick={() => setAccountSelection('profile-information')}
              >
                Profile Information
              </button>

              <button
                className="p-2 mb-3 w-full bg-secondary text-white rounded-md hover:bg-blue-600"
                onClick={() => setAccountSelection('profile-topics')}
              >
                Your Important Topics
              </button>
            </div>

            <div className="w-4/5 rounded-lg bg-sand">
              <AccountSelection selection={accountSelection} />
            </div>
          </div>
        ) : (
          <div>
            <p className="mb-4">You are not logged in.</p>
            <LoginWrapper />
          </div>
        )}

        <button
          className="p-2 mt-4 bg-red-500 text-white rounded-md hover:bg-red-600"
          onClick={logout}
        >
          Log Out
        </button>
      </div>
    </Layout>
  );
};

export default Account;
