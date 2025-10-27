import { useState, useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext";

// pass `initialIsFollowing` from the component, based on userDetails.Following
export default function useFollowFighter(initialIsFollowing = false) {
  const { user } = useAuth();

  const [isFollowing, setIsFollowing] = useState(initialIsFollowing);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [lastActionMessage, setLastActionMessage] = useState(null);

  // keep hook in sync if parent prop changes (e.g. card remounts w/ new data)
  useEffect(() => {
    setIsFollowing(initialIsFollowing);
  }, [initialIsFollowing]);

  const sendFollowAction = async (fighterId, action) => {
    if (!user || !user.uid) {
      setError("Not authenticated");
      return;
    }

    setLoading(true);
    setError(null);
    setLastActionMessage(null);

    // optimistic update
    const prev = isFollowing;
    const optimistic = action === "follow";
    setIsFollowing(optimistic);

    try {
      const res = await fetch("/api/fighters/followFighter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user.uid,
          fighterId,
          action, // "follow" or "unfollow"
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || `Failed to ${action}`);
      }

      console.log(`✅ ${action} success`, data);
      setLastActionMessage(data.message);
    } catch (err) {
      console.error(err);
      setError(err.message || "Something went wrong");
      // rollback optimistic change
      setIsFollowing(prev);
    } finally {
      setLoading(false);
    }
  };

  const followFighter = (fighterId) => sendFollowAction(fighterId, "follow");
  const unfollowFighter = (fighterId) => sendFollowAction(fighterId, "unfollow");

  return {
    isFollowing,
    loading,
    error,
    lastActionMessage,
    followFighter,
    unfollowFighter,
  };
}
