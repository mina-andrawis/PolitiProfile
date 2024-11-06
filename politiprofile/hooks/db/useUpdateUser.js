import { useState } from "react";

const useUpdateUser = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  // Function to update user data
  const updateUser = async (uid, updateData) => {
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await fetch("/api/db/updateUser", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          uid,
          updateData,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to update user");
      }

      setSuccess(data.message);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  return { updateUser, loading, error, success };
};

export default useUpdateUser;
