import { useState, useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext"; // Import useAuth hook

const useGetUserDetails = () => {
  const [userDetails, setUserDetails] = useState(null); // Initialize with null
  const [loading, setLoading] = useState(true); // Track loading state
  const [error, setError] = useState(null); // Handle errors

  const { user } = useAuth(); // Get the current user from the AuthContext

  useEffect(() => {
    const fetchUserDetails = async () => {
      if (user) {
        try {
          const response = await fetch("/api/db/getUserDetails", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ _id: user._id }), // Pass uid in request body
          });

          const data = await response.json();

          if (!response.ok) {
            throw new Error(data.error || "Failed to get user");
          }

          setUserDetails(data); // Set user details received from API
        } catch (error) {
          console.error("Error fetching user details:", error);
          setError("Failed to fetch user details.");
        } finally {
          setLoading(false);
        }
      } else {
        // If no authenticated user, reset state
        setUserDetails(null);
        setLoading(false);
      }
    };

    fetchUserDetails();
  }, [user]); // Only runs when `user` changes

  return { userDetails, loading, error };
};

export default useGetUserDetails;
