import { useState } from "react";

const useUpdateUser = () => {
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  // Function to update user data
  const updateUser = async (_id, updateData) => {
    setIsSaving(true);
    setError(null);
    setSuccess(null);

    console.log("Updating user with ID:", _id);
  console.log("Update data:", updateData);

    try {
      const response = await fetch("/api/user/updateUser", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          _id,
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
      setIsSaving(false);
    }
  };

  return { updateUser, isSaving, error, success };
};

export default useUpdateUser;
