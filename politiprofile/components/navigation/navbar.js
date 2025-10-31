import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import LoginWrapper from "../login-register/login-wrapper";
import { useRouter } from "next/router";
import { useAuth } from "../../contexts/AuthContext";

export default function NavBar() {
  const { user } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const router = useRouter();

  // Function to toggle the mobile menu
  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  // Function to determine if the link is active
  const isActive = (path) => router.pathname === path;

  return (
    <header className="fixed w-full top-0 left-0 bg-gradient-to-r from-blue-500 to-purple-500">
      <nav className="max-w-6xl mx-auto flex items-center justify-between py-1.5 px-12 lg:px-16">
        {/* Logo */}
        <div className="text-2xl font-bold text-white">
          <Link href="/featured-fighters">PolitiProfile</Link>
        </div>

        {/* Desktop Links */}
        <div className="hidden md:flex space-x-8 items-center">
          <Link href="/home">
            <button
              className={`${
                isActive("/home") ? "text-orange-300" : "text-white"
              } hover:text-orange-300 transition flex flex-col items-center`}
            >
              <svg className="w-6 h-6 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              <span>Home</span>
            </button>
          </Link>
          <Link href="/featured-fighters">
            <button
              className={`${
                isActive("/featured-fighters") ? "text-orange-300" : "text-white"
              } hover:text-orange-300 transition flex flex-col items-center`}
            >
              <svg className="w-6 h-6 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              <span>Featured Fighters</span>
            </button>
          </Link>
          <Link href="/about">
            <button
              className={`${
                isActive("/about") ? "text-orange-300" : "text-white"
              } hover:text-orange-300 transition flex flex-col items-center`}
            >
              <svg className="w-6 h-6 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>About</span>
            </button>
          </Link>
          <Link href="/your-topics">
            <button
              className={`${
                isActive("/your-topics") ? "text-orange-300" : "text-white"
              } hover:text-orange-300 transition flex flex-col items-center`}
            >
              <svg className="w-6 h-6 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
              <span>Your Topics</span>
            </button>
          </Link>
          <Link href="/bills">
            <button
              className={`${
                isActive("/bills") ? "text-orange-300" : "text-white"
              } hover:text-orange-300 transition flex flex-col items-center`}
            >
              <svg className="w-6 h-6 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <span>Bills</span>
            </button>
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
            <Link href="/home">
              <button
                className={`${
                  isActive("/home") ? "text-orange-300" : "text-white"
                } hover:text-orange-300 transition flex flex-col items-center`}
              >
                <svg className="w-6 h-6 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
                <span>Home</span>
              </button>
            </Link>
            <Link href="/featured-fighters">
              <button
                className={`${
                  isActive("/featured-fighters") ? "text-orange-300" : "text-white"
                } hover:text-orange-300 transition flex flex-col items-center`}
              >
                <svg className="w-6 h-6 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                <span>Featured Fighters</span>
              </button>
            </Link>
            <Link href="/about">
              <button
                className={`${
                  isActive("/about") ? "text-orange-300" : "text-white"
                } hover:text-orange-300 transition flex flex-col items-center`}
              >
                <svg className="w-6 h-6 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>About</span>
              </button>
            </Link>
            <Link href="/your-topics">
              <button
                className={`${
                  isActive("/your-topics") ? "text-orange-300" : "text-white"
                } hover:text-orange-300 transition flex flex-col items-center`}
              >
                <svg className="w-6 h-6 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
                <span>Your Topics</span>
              </button>
            </Link>
            <Link href="/bills">
              <button
                className={`${
                  isActive("/bills") ? "text-orange-300" : "text-white"
                } hover:text-orange-300 transition flex flex-col items-center`}
              >
                <svg className="w-6 h-6 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <span>Bills</span>
              </button>
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
