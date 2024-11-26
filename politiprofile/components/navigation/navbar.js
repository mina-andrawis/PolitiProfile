import React, { useState } from "react";
import Link from "next/link";
import LoginWrapper from "../login-register/login-wrapper";
import { useRouter } from "next/router";
import { useAuth } from "../../contexts/AuthContext";

export default function NavBar() {
  const { user } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false); // State to control mobile menu
  const router = useRouter();

  // Function to toggle the mobile menu
  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <header className="mb-6 mt-4 sticky top-0 z-50 bg-gradient-to-r from-blue-500 to-purple-500 shadow-md">
      <nav className="container mx-auto flex items-center justify-between py-4 px-6">
        {/* Logo */}
        <div className="text-2xl font-bold text-white">
          <Link href="/">PolitiProfile</Link>
        </div>

        {/* Desktop Links */}
        <div className="hidden md:flex space-x-6 items-center">
          <Link href="/">
            <button className="text-white hover:text-orange-300 transition">Home</button>
          </Link>
          <Link href="/about">
            <button className="text-white hover:text-orange-300 transition">About</button>
          </Link>
          <Link href="/your-topics">
            <button className="text-white hover:text-orange-300 transition">Your Topics</button>
          </Link>
          <Link href="/bills">
            <button className="text-white hover:text-orange-300 transition">Bills</button>
          </Link>

          {user ? (
            <button
              className="bg-orange-400 text-white px-4 py-2 rounded-md hover:bg-orange-500 transition"
              onClick={() => router.push("/account")}
            >
              Account
            </button>
          ) : (
            <LoginWrapper />
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-white text-3xl focus:outline-none"
          onClick={toggleMenu}
          aria-label="Toggle Menu"
        >
          ☰
        </button>
      </nav>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-gradient-to-r from-blue-500 to-purple-500 text-white">
          <div className="flex flex-col items-center space-y-4 py-4">
            <Link href="/">
              <button className="hover:text-orange-300 transition">Home</button>
            </Link>
            <Link href="/about">
              <button className="hover:text-orange-300 transition">About</button>
            </Link>
            <Link href="/your-topics">
              <button className="hover:text-orange-300 transition">Your Topics</button>
            </Link>
            <Link href="/bills">
              <button className="hover:text-orange-300 transition">Bills</button>
            </Link>

            {user ? (
              <button
                className="bg-orange-400 text-white px-4 py-2 rounded-md hover:bg-orange-500 transition"
                onClick={() => router.push("/account")}
              >
                Account
              </button>
            ) : (
              <LoginWrapper />
            )}
          </div>
        </div>
      )}
    </header>
  );
}
