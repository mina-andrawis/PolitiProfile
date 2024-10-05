import React, { useState } from "react";
import Link from "next/link";
import LoginWrapper from "../login-register/login-wrapper";
import { useRouter } from "next/router";
import useLoggedInState from "../../hooks/useAuthState";

export default function NavBar() {

  const { user, loading, navigateToLogin, navigateToAccount } = useLoggedInState(); // Use the hook

  if (loading) return <div>Loading...</div>; 

  return (
    <div className="my-3 flex w-full flex-col flex-wrap items-center rounded-md border bg-secondary p-2 md:flex-row">
      <div className="flex flex-grow items-center justify-start">
        <Link href="/">
          <button className="mr-6 p-3 text-xl text-white">Home</button>
        </Link>
        <Link href="/about">
          <button className="mr-6 p-3 text-xl text-white">About</button>
        </Link>
        <Link href="/compare-candidates">
          <button className="mr-6 p-3 text-xl text-white">
            Compare Candidates
          </button>
        </Link>
        <Link href="/education">
          <button className="mr-6 p-3 text-xl text-white">Education</button>
        </Link>
      </div>

      {user ? (
        <button
        className="mr-2 p-3 text-xl text-white bg-customOrange hover:bg-customOrange rounded-md "
          onClick={navigateToAccount}
        >
          Account
        </button>
      ) : (
        <LoginWrapper/>
      )}

    </div>
  );
}
