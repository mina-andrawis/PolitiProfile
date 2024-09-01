import React from 'react';
import Link from 'next/link';

export default function NavBar() {
  return (
    <div className="container flex flex-wrap p-5 my-3 flex-col md:flex-row items-center border bg-primary">
      <div className="md:ml-auto md:mr-auto flex flex-grow items-center text-base justify-center">
        <Link href="/">
          <button name="Home"className="mr-5 text-white">Home</button>
        </Link>
        <Link href="/about">
          <button name="About" className="mr-5 text-white">About</button>
        </Link>
        <Link href="/compare-candidates">
          <button name="Compare Candidates" className="mr-5 text-white">Compare Candidates</button>
        </Link>
        <Link href="/education">
          <button name="Education" className="mr-5 text-white">Education</button>
        </Link>
      </div>
      <Link href="/login">
        <button className="inline-flex items-center primary border-0 py-1 px-3 mt-4 md:mt-0 text-white">Login</button>
      </Link>
    </div>
  );
}
