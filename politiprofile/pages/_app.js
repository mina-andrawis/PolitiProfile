import Head from "next/head";
import "../global.css";
import "../styles/tailwind/output.css";
import { AuthProvider } from "../contexts/AuthContext";
import React from "react";

function MyApp({ Component, pageProps }) {
  // Set dark mode by default on initial load
  React.useEffect(() => {
    if (typeof window !== "undefined") {
      document.documentElement.classList.add("dark");
    }
  }, []);

  return (
    <AuthProvider>
      <Component {...pageProps} />
    </AuthProvider>
  );
}

export default MyApp;
