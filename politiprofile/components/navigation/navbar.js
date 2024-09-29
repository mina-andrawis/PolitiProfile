import React from "react";
import Link from "next/link";

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
      <Link href="/login">
        <button className="primary mt-4 inline-flex items-center border-0 px-3 py-1 text-white md:mt-0">
          Login
        </button>
      </Link>
    </div>
  );
}
