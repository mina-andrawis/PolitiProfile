import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import useAuthActions from "../hooks/useAuthActions"; // Handles actions like logout
import LoginWrapper from "../components/login-register/login-wrapper";
import Layout from "../components/layout";
import Head from "next/head";
import AccountSelection from "../components/account/account-selection";
import { useAuth } from "../contexts/AuthContext";
import useUserDetails from "../hooks/user/useGetUserDetails"; // Custom hook for user details

const Account = () => {
  const [accountSelection, setAccountSelection] = useState('profile-information');

  const { logout } = useAuthActions(); // Hook for logout action
  const { user, loading: authLoading } = useAuth(); // Get the current user and loading state from auth
  const { userDetails, loading: detailsLoading } = useUserDetails(); // Get user details and loading state

  // Show loading if either auth or user details are loading
  if (authLoading || detailsLoading) {
    return (
      <Layout>
      <div className="flex items-center justify-center h-auto">
        <div className="text-xl">Loading...</div>
      </div>
      </Layout>

    );
  }

  return (
    <Layout>
      <Head>
        <title>My Account</title>
      </Head>
      <div className="mx-auto w-full p-4 sm:p-6 text-left">
        <h1 className="mb-4 text-3xl sm:text-4xl font-bold">My Account</h1>

        {user ? (
          <div className="flex flex-col sm:flex-row">
            {/* Sidebar with buttons */}
            <div className="w-full sm:w-1/5 py-4 pr-4 sm:min-w-fit">
              <p className="mb-4 text-lg sm:text-base">Welcome, {userDetails?.name || userDetails?.email || "Loading..."}</p>

              <button
                className="p-2 mb-3 w-full bg-primary text-white rounded-md hover:bg-secondaryHover"
                onClick={() => setAccountSelection('profile-information')}
              >
                Profile Information
              </button>

              <button
                className="p-2 mb-3 w-full bg-primary text-white rounded-md hover:bg-secondaryHover"
                onClick={() => setAccountSelection('profile-topics')}
              >
                Your Important Topics
              </button>
            </div>

            {/* Main Content Area */}
            <div className="w-full sm:w-4/5 rounded-lg bg-sand mt-4 sm:mt-0">
              <AccountSelection selection={accountSelection} userDetails={userDetails} />
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
