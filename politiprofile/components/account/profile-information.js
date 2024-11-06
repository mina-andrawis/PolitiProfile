import React, { useState, useEffect } from "react";

const ProfileInformation = ({ userDetails, onSave, updating, error, success }) => {
  const [isEditingName, setIsEditingName] = useState(false);
  const [name, setName] = useState(userDetails?.name || "");

  // Update the local `name` state when `userDetails` changes
  useEffect(() => {
    if (userDetails) {
      setName(userDetails.name || "");
    }
  }, [userDetails]);

  const handleSaveName = () => {
    onSave(name);
    setIsEditingName(false);
  };

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">Profile Information</h2>
      <div className="mb-2">
        {isEditingName ? (
          <div className="flex items-center">
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="border px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <button
              onClick={handleSaveName}
              disabled={updating}
              className="ml-2 px-3 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:bg-gray-400"
            >
              {updating ? "Saving..." : "Save"}
            </button>
            <button
              onClick={() => setIsEditingName(false)}
              className="ml-2 px-3 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
            >
              Cancel
            </button>
          </div>
        ) : (
          <div className="flex items-center">
            <p className="mr-2">Name: {name || "No name set"}</p>
            <button
              onClick={() => setIsEditingName(true)}
              className="px-3 py-1 text-sm bg-indigo-500 text-white rounded-md hover:bg-secondaryHover"
            >
              Edit
            </button>
          </div>
        )}
      </div>
      {error && <p className="text-red-500 mt-2">{error}</p>}
      {success && <p className="text-green-500 mt-2">{success}</p>}
      <p className="mb-2">Email: {userDetails?.email}</p>
    </div>
  );
};

export default ProfileInformation;
