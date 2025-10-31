import React, { useState } from "react";
import LoginModal from "./login-modal";
import RegisterModal from "./register-modal";

const AuthModals = ({ isLoginInitiallyOpen = false, onClose }) => {
  // State for login and register modals
  const [isLoginOpen, setIsLoginOpen] = useState(isLoginInitiallyOpen);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);

  // Open/Close methods for login modal
  const openLoginModal = () => {
    setIsLoginOpen(true);
    setIsRegisterOpen(false); // Close the register modal
  };

  const closeLoginModal = () => {
    setIsLoginOpen(false);
    if (onClose) onClose();
  };

  // Open/Close methods for register modal
  const openRegisterModal = () => {
    setIsRegisterOpen(true);
    setIsLoginOpen(false); // Close the login modal
  };

  const closeRegisterModal = () => {
    setIsRegisterOpen(false);
    if (onClose) onClose();
  };

  return (
    <>
      <LoginModal 
        isOpen={isLoginOpen} 
        onClose={closeLoginModal} 
        onOpenRegister={openRegisterModal} 
      />
      <RegisterModal 
        isOpen={isRegisterOpen} 
        onClose={closeRegisterModal} 
        onOpenLogin={openLoginModal} 
      />
    </>
  );
};

// Also export the open functions so other components can use them
export const useAuthModals = () => {
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  
  const openLogin = () => setIsLoginOpen(true);
  const closeLogin = () => setIsLoginOpen(false);

  return {
    isLoginOpen,
    openLogin,
    closeLogin,
    AuthModals: ({ onClose }) => (
      <AuthModals 
        isLoginInitiallyOpen={isLoginOpen} 
        onClose={() => {
          closeLogin();
          if (onClose) onClose();
        }}
      />
    )
  };
};

export default AuthModals;