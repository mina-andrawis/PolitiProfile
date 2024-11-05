import { useState, useEffect } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../authentication/firebase"; // Import Firestore instance
import { getAuth, onAuthStateChanged } from "firebase/auth"; // Import onAuthStateChanged

const useUserDetails = () => {
  const [userDetails, setUserDetails] = useState(null); // Initialize with null
  const [loading, setLoading] = useState(true); // Track loading state
  const [error, setError] = useState(null); // Handle errors

  useEffect(() => {
    const auth = getAuth();
    
    const unsubscribe = onAuthStateChanged(auth, async (fireUser) => {
      if (fireUser) {
        try {
          console.log("fireUser UID:", fireUser.uid);
          setUserDetails(fireUser.uid); 
        } catch (error) {
          console.error("Error fetching user details:", error);
          setError("Failed to fetch user details.");
        }
      } else {
        console.log("No authenticated user");
        setUserDetails(null); // Reset user details if no user is authenticated
      }
      setLoading(false); // Loading complete regardless of result
    });

    // Cleanup the listener on component unmount
    return () => unsubscribe();
  }, []);

  return { userDetails, loading, error };
};

export default useUserDetails;
