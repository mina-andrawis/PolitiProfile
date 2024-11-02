import React, { useState } from "react";
import Link from "next/link";
import LoginWrapper from "../login-register/login-wrapper";
import { useRouter } from "next/router";
import useLoggedInState from "../../hooks/useAuthState";

export default function NavBar() {
  const { user, loading, navigateToLogin, navigateToAccount } = useLoggedInState();
  const [isMenuOpen, setIsMenuOpen] = useState(false); // State to control mobile menu
 
  const addData = async () => {
  
    try {
      const reponse = await fetch('/api/addUser', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: "Record of a Shriveled Datum", content: "No bytes, no problem. Just insert a document, in MongoDB" }),
      });
      const data = await reponse.json();
      console.log(data);
    }
    catch (error) {
      console.error('Error:', error);   
    }
  };

  if (loading) return <div>Loading...</div>;

  // Function to toggle the mobile menu
  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <div className="my-3 w-full rounded-md border bg-secondary">
      {/* Mobile Menu Button */}
      <div className="flex justify-between items-center p-3 md:hidden">
        <div className="text-white text-2xl font-bold">Logo</div>
        <button
          className="text-white text-3xl focus:outline-none"
          onClick={toggleMenu}
        >
          ☰ {/* Hamburger icon */}
        </button>
      </div>

      {/* Mobile Menu Links */}
      {isMenuOpen && (
        <div className="flex flex-col items-center md:hidden">
          <Link href="/">
            <button className="w-full py-2 text-lg text-white">Home</button>
          </Link>
          <Link href="/about">
            <button className="mr-6 p-3 text-xl text-white">About</button>
          </Link>
          <Link href="/your-topics">
            <button className="w-full py-2 text-lg text-white">Your Topics</button>
          </Link>
          <Link href="/compare-candidates">
            <button className="w-full py-2 text-lg text-white">Compare Candidates</button>
          </Link>
          {user ? (
            <button
              className="mt-2 w-full py-2 text-lg text-white bg-customOrange hover:bg-customOrange rounded-md"
              onClick={navigateToAccount}
            >
              Account
            </button>
          ) : (
            <LoginWrapper />
          )}
        </div>
      )}

      {/* Desktop Menu */}
      <div className="hidden md:flex w-full flex-col md:flex-row items-center justify-between p-1">
        <div className="flex items-center">
          <Link 
            onClick={addData}
            href="/">
            <button className="mr-6 p-3 text-xl text-white">Home</button>
          </Link>
          <Link href="/about">
            <button className="mr-6 p-3 text-xl text-white">About</button>
          </Link>
          <Link href="/your-topics">
            <button className="mr-6 p-3 text-xl text-white">Your Topics</button>
          </Link>
          <Link href="/compare-candidates">
            <button className="mr-6 p-3 text-xl text-white">Compare Candidates</button>
          </Link>

        </div>

        {user ? (
          <button
            className="mr-2 p-2 text-xl text-white bg-customOrange hover:bg-customOrange rounded-md"
            onClick={navigateToAccount}
          >
            Account
          </button>
        ) : (
          <LoginWrapper />
        )}
      </div>
    </div>
  );
}
