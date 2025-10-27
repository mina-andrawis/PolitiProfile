import React, { useState, useEffect } from 'react';
import useFollowFighter from '../../hooks/fighters/useFollowFighter';
import useGetUserDetails from '../../hooks/user/useGetUserDetails';

export default function FighterCard({ fighter }) {
  const { followFighter, loading } = useFollowFighter(fighter);
  const { userDetails, loading: detailsLoading } = useGetUserDetails();

  // local override for following state
  const [isFollowingLocal, setIsFollowingLocal] = useState(false);

  // sync local state with server data on mount / when data changes
  useEffect(() => {
    if (userDetails?.Following?.includes(fighter._id)) {
      setIsFollowingLocal(true);
    }
  }, [userDetails, fighter._id]);

  const handleFollow = async () => {
    // don't double-fire
    if (isFollowingLocal || loading) return;

    // optimistic UI update
    setIsFollowingLocal(true);

    try {
      await followFighter(fighter._id);
      // if it succeeds, we're already in the "following" state, nothing else to do
    } catch (err) {
      // if backend failed, roll back the optimistic change
      console.error('follow failed', err);
      setIsFollowingLocal(false);
      // you could also toast an error here
    }
  };

  const isFollowing = isFollowingLocal;

  return (
    <div className="bg-white rounded-xl shadow-md p-4 hover:shadow-lg transition">
      <div className="aspect-w-4 aspect-h-3 mb-4">
        <img
          src={fighter.photoUrl}
          alt={fighter.name}
          className="w-full h-full object-cover object-top rounded-md"
        />
      </div>

      <h2 className="text-xl text-gray-600 font-semibold">{fighter.name}</h2>
      <p className="text-sm text-gray-600 mb-2">{fighter.office}</p>

      <div className="flex flex-wrap gap-2 mb-2">
        {fighter.tags.map((tag) => (
          <span
            key={tag}
            className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded"
          >
            {tag}
          </span>
        ))}
      </div>

      <p className="text-sm italic text-gray-700">“{fighter.quote}”</p>

      <button
        onClick={handleFollow}
        disabled={loading || isFollowing}
        className={`mt-4 text-sm px-4 py-2 rounded ${
          isFollowing
            ? 'bg-green-600 hover:bg-green-700'
            : 'bg-red-600 hover:bg-red-700'
        } text-white disabled:opacity-50`}
      >
        {loading
          ? 'Following...'
          : isFollowing
            ? '✓ Following'
            : '❤️ Follow'}
      </button>
    </div>
  );
}
