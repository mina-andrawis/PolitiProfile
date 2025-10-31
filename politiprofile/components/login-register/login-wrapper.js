import React from "react";
import { useAuthModals } from "./auth-modals";

const LoginWrapper = () => {
  const { openLogin, AuthModals } = useAuthModals();

  return (
    <div>
      <button 
        onClick={openLogin} 
        className="mr-3 p-3 bg-accent rounded-md text-white"
      >
        Login
      </button>
      <AuthModals />
    </div>
  );
};

export default LoginWrapper;
