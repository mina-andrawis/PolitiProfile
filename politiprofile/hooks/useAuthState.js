//This handles user authentication state (like checking if a user is logged in) and provides the current user status, 
//allows conditionally render components (like the Login or Account button)

import { useState, useEffect } from "react";
import { auth } from "../authentication/firebase";
import { useRouter } from "next/router";

const useAuthState = () => {
  const [user, setUser] = useState(null); // Store the logged-in user
  const [loading, setLoading] = useState(true); // Track if the auth state is being loaded
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setUser(user);
      } else {
        setUser(null);
      }
      setLoading(false); // Loading is complete once we know the user's state
    });

    return () => unsubscribe(); // Cleanup listener on unmount
  }, []);
 
  const navigateHome = () => router.push("/"); // Redirect to login page
  const navigateToAccount = () => router.push("/account"); // Redirect to account page

  return { user, loading, navigateHome, navigateToAccount };
};

export default useAuthState;
