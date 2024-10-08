import React from "react";
import Layout from "../components/layout";
import Head from "next/head";

const candidate1 = {
  name: "Jane Doe",
  party: "Progressive Party",
  bio: "Jane has been a champion for environmental issues and social justice. She has a background in law and has worked on numerous policy reforms.",
  image: "https://via.placeholder.com/150",
};

const candidate2 = {
  name: "John Smith",
  party: "Conservative Party",
  bio: "John is known for his focus on economic development and national security. With a background in business, he brings a pragmatic approach to governance.",
  image: "https://via.placeholder.com/150",
};

const CandidateComparison = () => {
  return (
    <Layout>
      <Head>
        <title>Compare Candidates</title>
      </Head>
      <div className="flex flex-wrap justify-center gap-4 p-6">
        {/* Candidate 1 */}
        <div className="w-80 rounded-lg bg-white p-6 shadow-lg">
          <img
            src={candidate1.image}
            alt={`${candidate1.name}'s photo`}
            className="h-40 w-full rounded-t-lg object-cover"
          />
          <div className="p-4">
            <h2 className="text-xl font-bold">{candidate1.name}</h2>
            <p className="text-gray-500">{candidate1.party}</p>
            <div className="my-4 border-b"></div>
            <p className="text-gray-700">{candidate1.bio}</p>
          </div>
        </div>

        {/* Candidate 2 */}
        <div className="w-80 rounded-lg bg-white p-6 shadow-lg">
          <img
            src={candidate2.image}
            alt={`${candidate2.name}'s photo`}
            className="h-40 w-full rounded-t-lg object-cover"
          />
          <div className="p-4">
            <h2 className="text-xl font-bold">{candidate2.name}</h2>
            <p className="text-gray-500">{candidate2.party}</p>
            <div className="my-4 border-b"></div>
            <p className="text-gray-700">{candidate2.bio}</p>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default CandidateComparison;
