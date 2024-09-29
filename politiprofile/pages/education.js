import React from "react";
import Layout from "../components/layout";

const Education = () => {
  return (
    <Layout>
      <div className="p-6">
        <h1 className="mb-6 text-4xl font-bold">
          Understanding Politics and Elections
        </h1>

        <div className="space-y-6">
          {/* Politics Section */}
          <div className="rounded-lg bg-white p-6 shadow-md">
            <h2 className="mb-4 text-2xl font-semibold">How Politics Works</h2>
            <hr className="my-4 border-gray-300" />
            <p className="text-gray-700">
              Politics involves the processes through which decisions are made
              for a community, society, or country. It encompasses the
              mechanisms by which leaders are elected, laws are created, and
              policies are implemented. Political systems can vary widely,
              including democracies, monarchies, and authoritarian regimes.
            </p>
          </div>

          {/* Elections Section */}
          <div className="rounded-lg bg-white p-6 shadow-md">
            <h2 className="mb-4 text-2xl font-semibold">How Elections Occur</h2>
            <hr className="my-4 border-gray-300" />
            <p className="text-gray-700">
              Elections are a method for choosing leaders and deciding on public
              policies. They typically involve candidates running for office,
              campaigning to gain support, and voters casting their ballots. The
              process ensures that the will of the people is reflected in
              government decisions. Key elements include voter registration,
              voting procedures, and the counting of votes.
            </p>
          </div>

          {/* Voting Impact Section */}
          <div className="rounded-lg bg-white p-6 shadow-md">
            <h2 className="mb-4 text-2xl font-semibold">
              How Voting Makes a Difference
            </h2>
            <hr className="my-4 border-gray-300" />
            <p className="text-gray-700">
              Voting is a fundamental way for individuals to influence the
              direction of their community and country. By voting, citizens can
              support candidates and policies that align with their values and
              needs. Voting ensures that diverse perspectives are considered in
              decision-making processes, contributing to a more representative
              and responsive government.
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Education;
