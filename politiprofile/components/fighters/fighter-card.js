export default function FighterCard({ profile }) {
  return (
    <div className="bg-white rounded-xl shadow-md p-4 hover:shadow-lg transition">
      <img
        src={profile.photoUrl}
        alt={profile.name}
        className="w-full h-48 object-cover rounded-md mb-4"
      />
      <h2 className="text-xl font-semibold">{profile.name}</h2>
      <p className="text-sm text-gray-600 mb-2">{profile.office}</p>

      <div className="flex flex-wrap gap-2 mb-2">
        {profile.tags.map((tag) => (
          <span
            key={tag}
            className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded"
          >
            {tag}
          </span>
        ))}
      </div>

      <p className="text-sm italic text-gray-700">“{profile.quote}”</p>

      <button className="mt-4 text-sm bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700">
        ❤️ Follow
      </button>
    </div>
  )
}
