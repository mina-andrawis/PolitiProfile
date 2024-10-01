import React, { useState } from "react";
import Link from "next/link";
import LoginModal from "../login-register/login-modal";
import openLoginModal from "../login-register/login-wrapper";
import openRegisterModal from "../login-register/login-wrapper";
import LoginWrapper from "../login-register/login-wrapper";

export default function NavBar() {

  return (
    <div className="my-3 flex w-full flex-col flex-wrap items-center rounded-md border bg-primary p-2 md:flex-row">
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
        <LoginWrapper/>
    </div>
  );
}
