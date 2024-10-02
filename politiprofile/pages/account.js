// src/pages/account.js

import React from "react";
import { auth } from "../firebase";
import { useRouter } from "next/router";
import useAuth from "../hooks/useAuth";

const Account = () => {
  const router = useRouter();

  const { user, logout } = useAuth(); // Get the current user

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">My Account</h1>
      <p>Welcome to your account page.</p>

      <button
        onClick={logout}
        className="mt-4 px-4 py-2 bg-red-500 text-white rounded"
      >
        Logout
      </button>
    </div>
  );
};

export default Account;
