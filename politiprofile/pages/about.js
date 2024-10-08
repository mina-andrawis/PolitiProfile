import React from "react";
import Layout from "../components/layout";
import Head from "next/head";

const About = () => {
  return (
    <Layout>
      <Head>
        <title>About PolitiProfile</title>
      </Head>
      <div className="p-6">
        <h1 className="mb-6 text-4xl text-center font-bold">Empowering Citizens, Strengthening Democracy</h1>

        <div className="space-y-6">
          {/* Overview Section */}
          <div className="rounded-lg bg-white p-6 shadow-md">
            <h2 className="mb-4 text-2xl font-semibold">What is PolitiProfile?</h2>
            <hr className="my-4 border-gray-300" />
            <p className="text-gray-700">
              PolitiProfile is a cutting-edge platform designed to bridge the gap between U.S. citizens and their elected representatives. We believe in creating a space where citizens can have access to real, actionable data about their representatives, empowering them to make informed choices that align with their values and priorities. By offering personalized insights into political issues and the representatives who champion them, PolitiProfile makes navigating the political landscape easier, more transparent, and accessible for all.
            </p>
          </div>

          {/* Empowering Citizens Section */}
          <div className="rounded-lg bg-white p-6 shadow-md">
            <h2 className="mb-4 text-2xl font-semibold">How PolitiProfile Empowers You</h2>
            <hr className="my-4 border-gray-300" />
            <p className="text-gray-700">
              Our mission is to empower U.S. citizens by giving them control over their political engagement. Through PolitiProfile, you can:
            </p>
            <ul className="list-disc list-inside mt-4 text-gray-700">
              <li>Track and compare representatives' positions on key issues that matter to you.</li>
              <li>Select and prioritize topics that align with your values, such as healthcare, education, climate change, and more.</li>
              <li>Receive up-to-date information about how your representatives vote, the bills they sponsor, and their stances on critical issues.</li>
              <li>Access unbiased, transparent data to help you make informed decisions during elections.</li>
            </ul>
          </div>

          {/* Supporting Representatives Section */}
          <div className="rounded-lg bg-white p-6 shadow-md">
            <h2 className="mb-4 text-2xl font-semibold">Championing the Representatives Who Make a Difference</h2>
            <hr className="my-4 border-gray-300" />
            <p className="text-gray-700">
              Not all representatives are the same, and many go above and beyond to fight for the rights of the people. PolitiProfile allows you to recognize and support those who champion important causes such as civil rights, climate action, healthcare reform, and more. We spotlight the efforts of representatives who genuinely work for the betterment of their constituents and fight for causes that impact the lives of everyday Americans. Together, we can uplift and empower those representatives who continue to fight the good fight.
            </p>
          </div>

          {/* Taking Back Political Control */}
          <div className="rounded-lg bg-white p-6 shadow-md">
            <h2 className="mb-4 text-2xl font-semibold">Taking Back Control of Politics</h2>
            <hr className="my-4 border-gray-300" />
            <p className="text-gray-700">
              Politics today can feel overwhelming, but PolitiProfile simplifies the process of understanding the issues and the people who represent you. By providing tools to hold your representatives accountable and access to the data you need, we aim to make political participation easier and more impactful. It's time to shift the power back to the people by making informed decisions that reflect your values, beliefs, and the changes you want to see in society.
            </p>
          </div>

          {/* Call to Action Section */}
          <div className="rounded-lg bg-white p-6 shadow-md">
            <h2 className="mb-4 text-2xl font-semibold">Get Involved</h2>
            <hr className="my-4 border-gray-300" />
            <p className="text-gray-700">
              Whether you’re looking to stay informed, engage more deeply with your representatives, or take back control of the political system, PolitiProfile is here to help. Create your profile, select your topics, and take the first step toward empowering yourself in the world of politics.
            </p>
            <p className="text-gray-700 font-bold mt-4">
              Together, we can ensure that the voices of the many shape the future of this country.
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default About;
