// components/account/account-selection.js
import React from "react";
import ProfileInformation from "./profile-information";
import useUpdateUser from "../../hooks/user/useUpdateUser";

const AccountSelection = ({ selection, userDetails }) => {
  const { updateUser, loading: updating, error: updateError, success: updateSuccess } = useUpdateUser();

  const handleSaveName = async (name) => {
    try {
      await updateUser(userDetails._id, { name });
    } catch (error) {
      console.error("Error updating name: ", error);
    }
  };

  return (
    <div className="p-6 mt-4 shadow-xl border-double border-4">
      {selection === "profile-information" && (
        <ProfileInformation
          userDetails={userDetails}
          onSave={handleSaveName}
          updating={updating}
          updateError={updateError}
          updateSuccess={updateSuccess}
        />
      )}

      {selection === "profile-topics" && (
        <div>
          <h2 className="text-2xl font-semibold mb-4">Your Important Topics</h2>
          <ul>
            {userDetails?.topics && userDetails.topics.length > 0 ? (
              userDetails.topics.map((topic, index) => <li key={index}>⦾ {topic}</li>)
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
