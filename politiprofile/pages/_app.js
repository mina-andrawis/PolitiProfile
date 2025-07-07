import Head from "next/head";
import "../global.css";
import "../styles/tailwind/output.css";
import { AuthProvider } from "../contexts/AuthContext";
import React from "react";

function MyApp({ Component, pageProps }) {
  return (
    <AuthProvider>
      <Component {...pageProps} />
    </AuthProvider>
  );
}

export default MyApp;
