//Handles authentication-related tasks such as logging in, signing up, logging out, and error handling.

import { useState } from "react";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../authentication/firebase";

const useAuth = () => {
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const register = async (email, password, confirmPassword) => {
    setError("");
    setSuccess(false);
    setLoading(true);

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    try {
      // Create a new user with Firebase Authentication
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      setSuccess(true);
      setError("");
      return userCredential.user;
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Sign in user with email and password
  const login = async (email, password) => {
    setError("");
    setSuccess(false);
    setLoading(true);

    try {
      // Sign in user with Firebase Authentication
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      setSuccess(true);
      setError("");
      return userCredential.user;
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

      // Log out the current user
    const logout = async () => {
      setLoading(true);
      try {
        await signOut(auth);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

  return {
    register,
    login,
    logout,
    error,
    success,
    loading,
  };
};

export default useAuth;