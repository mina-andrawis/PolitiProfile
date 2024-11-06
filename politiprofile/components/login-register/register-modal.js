import React, { useState } from "react";
import useAuth from "../../hooks/useAuthActions"; // Import the custom hook
import useAddUser from "../../hooks/db/useAddUser"; // Import the custom hook


const RegisterModal = ({ isOpen, onClose, onOpenLogin }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  
  const { register, error, success, loading } = useAuth();
  const { addUser } = useAddUser();

  if (!isOpen) return null;

  const handleRegister = async (e) => {
    e.preventDefault();
    const user = await register(email, password, confirmPassword);

    if (user) {
      console.log("User created:", user);
      onClose();
      onOpenLogin(); // Switch to login modal after successful registration
    }

    try {
      addUser(user.uid, user.email);
      console.log("User created in MongoDB with with ID: ", user.uid);
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="relative w-full max-w-md rounded-lg bg-white p-8 shadow-lg">
        <button
          className="absolute right-2 top-2 text-xl font-bold text-gray-500 hover:text-gray-900"
          onClick={onClose}
        >
          &times;
        </button>
        <h2 className="mb-6 text-center text-2xl font-semibold text-gray-800">
          Create an Account
        </h2>

        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
        {success && <p className="text-green-500 text-sm mb-4">Registration successful!</p>}

        <form onSubmit={handleRegister}>
          <div className="mb-4">
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-4 py-2 transition focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Enter your email"
              required
            />
          </div>
          <div className="mb-4">
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-4 py-2 transition focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Enter your password"
              required
            />
          </div>
          <div className="mb-6">
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Confirm Password
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-4 py-2 transition focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Confirm your password"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full rounded-lg bg-indigo-600 py-2 text-white transition hover:bg-indigo-700 focus:ring-4 focus:ring-indigo-400"
            disabled={loading}
          >
            {loading ? "Registering..." : "Register"}
          </button>
        </form>

        <div className="mt-4 text-center text-sm text-gray-600">
          Already have an account?{" "}
          <button
            onClick={onOpenLogin}
            className="text-indigo-600 hover:text-indigo-500 font-semibold"
          >
            Sign In
          </button>
        </div>
      </div>
    </div>
  );
};

export default RegisterModal;
