import { useState } from "react";

const useAddFighter = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const addFighter = async (fighterData) => {
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await fetch("/api/fighters/followFighter", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(fighterData), // send full fighter object
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to add fighter");
      }

      setSuccess(data.message);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  return { addFighter, loading, error, success };
};

export default useAddFighter;
