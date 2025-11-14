import { useState, useEffect } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "../../contexts/AuthContext";

const followFighterAPI = async ({ userId, fighterId, action }) => {
  const res = await fetch("/api/fighters/followFighter", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userId, fighterId, action }),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.error || `Failed to ${action}`);
  }

  return data;
};

// pass `initialIsFollowing` from the component, based on userDetails.Following
export default function useFollowFighter(initialIsFollowing = false) {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const [isFollowing, setIsFollowing] = useState(initialIsFollowing);

  // keep hook in sync if parent prop changes (e.g. card remounts w/ new data)
  useEffect(() => {
    setIsFollowing(initialIsFollowing);
  }, [initialIsFollowing]);

  const mutation = useMutation({
    mutationFn: followFighterAPI,
    onMutate: async ({ action }) => {
      // optimistic update
      const optimistic = action === "follow";
      setIsFollowing(optimistic);
    },
    onSuccess: (data) => {
      console.log(`✅ ${data.message}`);
      // Invalidate and refetch fighters and user details
      queryClient.invalidateQueries({ queryKey: ['fighters'] });
      queryClient.invalidateQueries({ queryKey: ['userDetails'] });
    },
    onError: (error, variables, context) => {
      console.error(error);
      // rollback optimistic change
      setIsFollowing(!isFollowing);
    },
  });

  const followFighter = (fighterId) => {
    if (!user || !user.uid) {
      mutation.mutate({ userId: null, fighterId, action: "follow" });
      return;
    }
    mutation.mutate({ userId: user.uid, fighterId, action: "follow" });
  };

  const unfollowFighter = (fighterId) => {
    if (!user || !user.uid) {
      mutation.mutate({ userId: null, fighterId, action: "unfollow" });
      return;
    }
    mutation.mutate({ userId: user.uid, fighterId, action: "unfollow" });
  };

  return {
    isFollowing,
    loading: mutation.isPending,
    error: mutation.error?.message || null,
    lastActionMessage: mutation.data?.message || null,
    followFighter,
    unfollowFighter,
  };
}
