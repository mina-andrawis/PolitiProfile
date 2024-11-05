import React, { useState, useEffect } from "react";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../authentication/firebase"; // Import Firestore instance
import useUserDetails from "../hooks/useUserDetails";
import useUpdateUser from "../hooks/db/useUpdateUser";

const AccountSelection = ({ selection }) => {
  const { userDetails } = useUserDetails(); // Get user details from custom hook

  const [isEditingName, setIsEditingName] = useState(false);
  const [name, setName] = useState(userDetails?.name || ""); // Initialize with current name
  const [isSaving, setIsSaving] = useState(false);

  const { updateUser, loading, error, success } = useUpdateUser(); // Custom hook to update user details

  
  // UseEffect to update the local `name` state when `userDetails` changes
  useEffect(() => {
    if (userDetails) {
      setName(userDetails.name || ""); // Update the name when userDetails changes
    }
  }, [userDetails]); // Only runs when userDetails changes

  const handleSaveName = async () => {
    setIsSaving(true);
    try {
      updateUser(userDetails.uid, { name });
      setIsEditingName(false);
    } catch (error) {
      console.error("Error updating name: ", error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="p-6 mt-4 shadow-xl border-double border-4">
      {selection === "profile-information" && (
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
                  disabled={isSaving}
                  className="ml-2 px-3 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:bg-gray-400"
                >
                  {isSaving ? "Saving..." : "Save"}
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
                  className="px-3 py-1text-sm bg-indigo-500 text-white rounded-md hover:bg-secondaryHover"
                >
                  Edit
                </button>
              </div>
            )}
          </div>

          <p className="mb-2">Email: {userDetails?.email}</p>
        </div>
      )}

      {selection === "profile-topics" && (
        <div>
          <h2 className="text-2xl font-semibold mb-4">Your Important Topics</h2>
          <ul>
            {userDetails?.topics && userDetails.topics.length > 0 ? (
              userDetails.topics.map((topic, index) => (
                <li key={index}>⦾ {topic}</li>
              ))
            ) : (
              <li>
                Go to the <b>Your Topics</b> tab to select your important topics!
              </li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
};

export default AccountSelection;
