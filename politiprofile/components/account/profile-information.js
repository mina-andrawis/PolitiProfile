// components/account/ProfileInformation.js
import React, { useState, useEffect } from "react";
import ThemeToggle from "../theme-toggle";


const ProfileInformation = ({ userDetails, onSave, updating, updateError, updateSuccess }) => {
  const [isEditingName, setIsEditingName] = useState(false);
  const [name, setName] = useState(userDetails?.name || "");

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
              className="border px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:secondary"
            />
            <button
              onClick={handleSaveName}
              disabled={updating}
              className="ml-2 px-3 py-2 bg-primary text-white rounded-md hover:secondary disabled:bg-gray-400"
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
              className="px-3 py-1 text-sm bg-primary text-white rounded-md hover:bg-secondaryHover"
            >
              Edit
            </button>
          </div>
        )}
      </div>
      {updateError && <p className="text-red-500 mt-2">{updateError}</p>}
      {updateSuccess && <p className="text-green-500 mt-2">{updateSuccess}</p>}
      <p className="mb-2">Email: {userDetails?.email}</p>
      <ThemeToggle />
    </div>
  );
};

export default ProfileInformation;
