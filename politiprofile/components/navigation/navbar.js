import React from 'react';
import Link from 'next/link';

export default function NavBar() {
  return (
    <div className="w-full flex flex-wrap p-5 my-3 flex-col md:flex-row items-center border bg-primary rounded-md">
      <div className="flex items-center justify-start flex-grow">
        <Link href="/">
          <button name="Home" className="mr-6 text-white text-xl">Home</button>
        </Link>
        <Link href="/about">
          <button name="About" className="mr-6 text-white text-xl">About</button>
        </Link>
        <Link href="/compare-candidates">
          <button name="Compare Candidates" className="mr-6 text-white text-xl">Compare Candidates</button>
        </Link>
        <Link href="/education">
          <button name="Education" className="mr-6 text-white text-xl">Education</button>
        </Link>
      </div>
      <Link href="/login">
        <button className="inline-flex items-center primary border-0 py-1 px-3 mt-4 md:mt-0 text-white">Login</button>
      </Link>
    </div>
  );
}
