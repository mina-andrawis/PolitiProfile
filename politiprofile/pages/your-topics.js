import React, { useState, useEffect } from "react";
import Layout from "../components/layout";
import Head from "next/head";
import useUserDetails from "../hooks/user/useGetUserDetails"; 
import topics from "../helpers/topics";
import useUpdateUser from "../hooks/user/useUpdateUser"; 

export default function YourTopics() {
  const [selectedTopics, setSelectedTopics] = useState([]);
  const [openTopics, setOpenTopics] = useState({});
  const [saveError, setSaveError] = useState(null);
  const [saveSuccess, setSaveSuccess] = useState(null);


  const { userDetails } = useUserDetails(); 
  const { updateUser, isSaving, error: updateError, success: updateSuccess } = useUpdateUser();


  const handleTopicChange = (topic) => {
    if (selectedTopics.includes(topic)) {
      setSelectedTopics(selectedTopics.filter((t) => t !== topic));
    } else {
      setSelectedTopics([...selectedTopics, topic]);
    }
  };

  const toggleTopic = (topicName) => {
    setOpenTopics({
      ...openTopics,
      [topicName]: !openTopics[topicName],
    });
  };

  useEffect(() => {
    if (userDetails && userDetails.topics) {
      setSelectedTopics(userDetails.topics);
    }
  }, [userDetails]); // Add userDetails as dependency

  return (
    <Layout>
      <Head>
        <title>Your Topics</title>
      </Head>
      <div className="mx-auto w-full p-6 text-center">
        <p className="text-lg mb-3">
          We all have political topics that are important to us.
        </p>
        <p className="text-lg">
          Here, you can select which topics you hold dear and see how your representatives stack up on those issues.
        </p>

        {/* Topic Selection Section */}
        <div className="mt-6">
          <h2 className="text-3xl font-semibold mb-4">Select Your Topics:</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-left">
            {topics.map((topic) => (
              <div key={topic.name} className="border p-4 rounded-lg">
                <input
                  type="checkbox"
                  value={topic.name}
                  checked={selectedTopics.includes(topic.name)}
                  onChange={() => handleTopicChange(topic.name)}
                  className="mr-2"
                />
                <div
                  className="flex justify-between items-center cursor-pointer p-0 rounded-lg"
                  onClick={() => toggleTopic(topic.name)}
                >
                  <span className="font-semibold">
                    {topic.name}
                  </span>
                  <span className="text-2xl">
                    {openTopics[topic.name] ? "−" : "↧"}
                  </span>
                </div>

                {/* Topic Description Dropdown */}
                {openTopics[topic.name] && (
                  <p className="mt-2 text-md text-secondaryTextColor mb-8">{topic.description}</p>
                )}
              </div>
            ))}
          </div>

          {/* Save Button */}
          <button
            onClick={() => updateUser(userDetails._id,{topics:selectedTopics})}
            disabled={isSaving}
            className={`mt-6 px-4 py-2 rounded-md text-white ${isSaving ? 'bg-gray-400' : 'bg-secondary hover:bg-secondaryHover'}`}
          >
            {isSaving ? "Saving..." : "Save Topics"}
          </button>

          {/* Display messages if any */}
          {updateError && <p className="text-red-500 mt-3">{updateError}</p>}
          {updateSuccess && <p className="text-secondary mt-3">{updateSuccess}</p>}

        </div>
      </div>
    </Layout>
  );
}
