import React from "react";

const AccountSelection = ({ selection, userProfile }) => {
  return (
    <div className="p-6 mt-4 shadow-xl border-double border-4">
      {selection === "profile-information" && (
        <div>
          <h2 className="text-2xl font-semibold mb-4">Profile Information</h2>
          <p className="mb-2">Name: John Doe</p>
          <p className="mb-2">Email: {userProfile.email}</p>
          <p className="mb-2">Phone: (123) 456-7890</p>
        </div>
      )}

      {selection === "profile-topics" && (
        <div>
          <h2 className="text-2xl font-semibold mb-4">Your Important Topics</h2>
          <ul className="list-disc list-inside">
            <li>Climate Change</li>
            <li>Healthcare Reform</li>
            <li>Education Policies</li>
            <li>Tech Innovations</li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default AccountSelection;
