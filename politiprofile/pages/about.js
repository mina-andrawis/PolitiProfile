import React from 'react';
import NavBar from '../components/navigation/navbar';
import Layout from '../components/layout';
import Head from 'next/head';

export default function About() {
    return (
        <Layout>
            <Head>
                <title>About PolitiProfile</title>
            </Head>
            <div className="w-full p-6 mx-auto text-center">
                <h1 className="text-4xl font-bold mb-4">About</h1>
                <p className="text-lg leading-relaxed">
                    PolitiProfile is a platform that allows users to connect with politicians and candidates 
                    that align with their ideals. Compare candidates for elections and discover insights 
                    on key political issues.
                </p>
            </div>
        </Layout>
    );
}
