import React, {useState} from "react";
import useAuthActions from "../../hooks/useAuthActions";


const LoginModal = ({ isOpen, onClose, onOpenRegister }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  
  const {login, error, success, loading} = useAuthActions();

  if (!isOpen) return null; // Don't render if modal is not open

  const handleLogin = async (e) => {
    e.preventDefault();
    const user = await login(email, password);

    if (user) {
      console.log("Use Logged In:", user);
      onClose();
    }
  
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="relative w-full max-w-md rounded-lg bg-white p-8 shadow-lg">
        <button
          className="absolute right-2 top-1 text-xl font-bold text-primary hover:text-gray-900"
          onClick={onClose}
        >
          &times;
        </button>
        <h2 className="mb-6 text-center text-2xl font-semibold text-dark ">Sign in to PolitiProfile</h2>

        <form>
          <div className="mb-4">
            <label className="mb-1 block text-sm font-medium text-primary">Email</label>
            <input
              type="email"
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-lg border border-dark text-dark px-4 py-2 transition focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Enter your email"
              required
            />
          </div>
          <div className="mb-6">
            <label className="mb-1 block text-sm font-medium text-primary">Password</label>
            <input
              type="password"
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-lg border border-dark text-dark px-4 py-2 transition focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Enter your password"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full rounded-lg bg-primary py-2 text-white transition hover:bg-indigo-700 focus:ring-4 focus:ring-indigo-400"
            onClick={handleLogin}
          >
            Sign In
          </button>
        </form>

        {/* Sign Up button with onClick trigger to open the register modal */}
        <div className="mt-4 text-center text-sm text-dark">
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
