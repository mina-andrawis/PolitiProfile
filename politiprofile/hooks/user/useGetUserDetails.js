import { useQuery } from "@tanstack/react-query";
import { useAuth } from "../../contexts/AuthContext";

const fetchUserDetails = async (userId) => {
  if (!userId) {
    return null;
  }

  console.log("Fetching details for user ID:", userId);
  const response = await fetch(`/api/user/getUserDetails`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ _id: userId }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || "Failed to get user");
  }

  return data.user;
};

const useGetUserDetails = () => {
  const { user } = useAuth();

  const { data, isLoading, error } = useQuery({
    queryKey: ['userDetails', user?.uid],
    queryFn: () => fetchUserDetails(user?.uid),
    enabled: !!user, // Only run query if user is authenticated
  });

  return {
    userDetails: data || null,
    loading: isLoading,
    error: error?.message || null,
  };
};

export default useGetUserDetails;
