import React from "react";

const LoginModal = ({ isOpen, onClose, onOpenRegister }) => {
  if (!isOpen) return null; // Don't render if modal is not open

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="relative w-full max-w-md rounded-lg bg-white p-8 shadow-lg">
        <button
          className="absolute right-2 top-2 text-xl font-bold text-gray-500 hover:text-gray-900"
          onClick={onClose}
        >
          &times;
        </button>
        <h2 className="mb-6 text-center text-2xl font-semibold text-gray-800">Sign in to PolitiProfile</h2>

        <form>
          <div className="mb-4">
            <label className="mb-1 block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              className="w-full rounded-lg border border-gray-300 px-4 py-2 transition focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Enter your email"
              required
            />
          </div>
          <div className="mb-6">
            <label className="mb-1 block text-sm font-medium text-gray-700">Password</label>
            <input
              type="password"
              className="w-full rounded-lg border border-gray-300 px-4 py-2 transition focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Enter your password"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full rounded-lg bg-indigo-600 py-2 text-white transition hover:bg-indigo-700 focus:ring-4 focus:ring-indigo-400"
          >
            Sign In
          </button>
        </form>

        {/* Sign Up button with onClick trigger to open the register modal */}
        <div className="mt-4 text-center text-sm text-gray-600">
          Don't have an account?{" "}
          <button onClick={onOpenRegister} className="text-indigo-600 hover:text-indigo-500 font-semibold">
            Sign Up
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginModal;
