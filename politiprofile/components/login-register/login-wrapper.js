import React, { useState } from "react";
import LoginModal from "./login-modal";
import RegisterModal from "./register-modal";

const LoginWrapper = () => {
  // State for login and register modals
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);

  // Open/Close methods for login modal
  const openLoginModal = () => {
    setIsLoginOpen(true);
    setIsRegisterOpen(false); // Close the register modal
  };

  const closeLoginModal = () => {
    setIsLoginOpen(false);
  };

  // Open/Close methods for register modal
  const openRegisterModal = () => {
    setIsRegisterOpen(true);
    setIsLoginOpen(false); // Close the login modal
  };

  const closeRegisterModal = () => {
    setIsRegisterOpen(false);
  };

  return (
    <div >
      <button onClick={openLoginModal} className="mr-3 p-3 bg-accent rounded-md text-white">
        Login
      </button>

      <LoginModal isOpen={isLoginOpen} onClose={closeLoginModal} onOpenRegister={openRegisterModal} />
      <RegisterModal isOpen={isRegisterOpen} onClose={closeRegisterModal} onOpenLogin={openLoginModal} />
    </div>
  );
};

export default LoginWrapper;
