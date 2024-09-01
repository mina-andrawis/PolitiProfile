//create a simple about page explainign what this app is

import React from 'react';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import NavBar from '../components/navigation/navbar';
import Layout from '../components/layout';
import Head from 'next/head';

export default function About() {
    return (
        <Layout>
        <Head>
            <title>About PolitiProfile</title>
        </Head>
        <Container>
            <Box sx={{ my: 4 }}>
                <Typography variant="h4" component="h1" gutterBottom>
                    About
                </Typography>
                <Typography>
                    PolitiProfile is a platform that allows users to connect with politicians and candidates that align with their ideals. Compare candidates for elections and discover insights on key political issues.
                </Typography>
            </Box>
        </Container>
        </Layout>
    );
    }