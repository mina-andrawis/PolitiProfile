import React, { useState } from "react";
import Layout from "../components/layout";
import Head from "next/head";
import { db } from "../firebase";
import { doc, setDoc } from "firebase/firestore";
import useAuthState from "../hooks/useAuthState";
import topics from "../helpers/topics";
import useSaveTopics from "../hooks/useSaveTopics";

export default function About() {
  const { user } = useAuthState(); 
  const [selectedTopics, setSelectedTopics] = useState([]);
  const [openTopics, setOpenTopics] = useState({}); 

  const {saveTopicsToProfile, isSaving, saveError} = useSaveTopics();

   const handleTopicChange = (topic) => {
    if (selectedTopics.includes(topic)) {
      setSelectedTopics(selectedTopics.filter((t) => t !== topic));
    } else {
      setSelectedTopics([...selectedTopics, topic]);
    }
  };

  // Toggle dropdown visibility for each topic
  const toggleTopic = (topicName) => {
    setOpenTopics({
      ...openTopics,
      [topicName]: !openTopics[topicName],
    });
  };

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
              {/* Wrap label and button inside a div to make the whole area clickable */}
              <div
                className="flex justify-between items-center cursor-pointer p-0 rounded-lg"
                onClick={() => toggleTopic(topic.name)} // Make entire area clickable
              >
                
                <span className="font-semibold">
                  {topic.name}
                </span>
                <span>
                  {openTopics[topic.name] ? "-" : "+"}
                </span>
              </div>
            
              {/* Topic Description Dropdown */}
              {openTopics[topic.name] && (
                <p className="mt-2 text-md text-secondaryTextColor mb-8">{topic.description}</p>
              )}
            
              {/* Topic Checkbox */}
            </div>
            
            ))}
          </div>

          {/* Save Button */}
          <button
            onClick={() => saveTopicsToProfile(user, selectedTopics)}
            disabled={isSaving}
            className={`mt-6 px-4 py-2 rounded-md text-white ${isSaving ? 'bg-gray-400' : 'bg-blue-500 hover:bg-blue-600'}`}
          >
            {isSaving ? "Saving..." : "Save Topics to Profile"}
          </button>

          {/* Display error message if any */}
          {saveError && <p className="text-red-500 mt-3">{saveError}</p>}
        </div>
      </div>
    </Layout>
  );
}