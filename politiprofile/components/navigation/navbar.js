import React, { useState } from "react";
import Link from "next/link";
import LoginModal from "../login-modal";

export default function NavBar() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleLoginClick = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

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
      <button
        className="mr-4 p-3 text-xl text-white"
        onClick={handleLoginClick} // When clicked, open the modal
      >
        Login
      </button>

      {/* Render the LoginModal component */}
      <LoginModal isOpen={isModalOpen} onClose={handleCloseModal} />
    </div>
  );
}
