import { useState } from "react";
import { useAuth } from "../../contexts/AuthContext";

const useFollowFighter = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const followFighter = async (fighterId) => {
    setLoading(true);
    setError(null);
    setSuccess(null);
    if (!user || !user.uid || !fighterId) {
      setError("Missing user or fighter information");
      setLoading(false);
      return;
    }
      console.log("useFollowFighter logic: userId:", user.uid, "fighterId:", fighterId);

    try {
      console.log("Attempting to follow fighter:", fighterId);
      const response = await fetch("/api/fighters/followFighter", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: user.uid,
          fighterId: fighterId,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to follow fighter");
      }

      console.log("Fighter followed successfully:", fighterId);
      setSuccess(data.message);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  return { followFighter, loading, error, success };
};

export default useFollowFighter;