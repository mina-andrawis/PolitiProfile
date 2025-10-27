import React, { useMemo } from "react";
import useGetUserDetails from "../../hooks/user/useGetUserDetails";
import useFollowFighter from "../../hooks/fighters/useFollowFighter";

export default function FighterCard({ fighter }) {
  // grab user details (includes Following array)
  const { userDetails, loading: detailsLoading } = useGetUserDetails();

  // compute initial follow state for THIS fighter
  const initialIsFollowing = useMemo(() => {
    // userDetails?.Following is assumed to be array of ObjectIds from Mongo
    // fighter._id is also an ObjectId (string form in frontend)
    if (!userDetails || !userDetails.Following) return false;

    // normalize everything to string for comparison
    return userDetails.Following.some(
      (followedId) => String(followedId) === String(fighter._id)
    );
  }, [userDetails, fighter._id]);

  // hook that manages follow state + server calls
  const {
    isFollowing,
    loading,
    followFighter,
    unfollowFighter,
  } = useFollowFighter(initialIsFollowing);

  // click handler switches based on current state
  const handleFollowClick = async () => {
    if (isFollowing) {
      await unfollowFighter(fighter._id);
    } else {
      await followFighter(fighter._id);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-4 hover:shadow-lg transition">
      <div className="aspect-w-4 aspect-h-3 mb-4">
        <img
          src={fighter.photoUrl}
          alt={fighter.name}
          className="w-full h-full object-cover object-top rounded-md"
        />
      </div>

      <h2 className="text-xl text-gray-800 font-semibold">{fighter.name}</h2>
      <p className="text-sm text-gray-600 mb-2">{fighter.office}</p>

      <div className="flex flex-wrap gap-2 mb-2">
        {fighter.tags?.map((tag) => (
          <span
            key={tag}
            className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded"
          >
            {tag}
          </span>
        ))}
      </div>

      {fighter.quote && (
        <p className="text-sm italic text-gray-700">“{fighter.quote}”</p>
      )}

      <button
        onClick={handleFollowClick}
        disabled={loading || detailsLoading}
        className={`mt-4 text-sm px-4 py-2 rounded text-white disabled:opacity-50 transition
          ${
            isFollowing
              ? "bg-green-600 hover:bg-green-700"
              : "bg-red-600 hover:bg-red-700"
          }
        `}
      >
        {loading
          ? (isFollowing ? "Following..." : "Unfollowing...")
          : isFollowing
            ? "✓ Following"
            : "❤️ Follow"}
      </button>
    </div>
  );
}
