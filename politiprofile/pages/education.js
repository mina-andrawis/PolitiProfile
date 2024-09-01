import React from 'react';
import { Card, CardContent, Typography, Box, Divider, Stack } from '@mui/material';
import Layout from '../components/layout';
import Container from '@mui/material/Container';

const Education = () => {
  return (
    <Layout>
        <Box sx={{ flexGrow: 1, p: 3 }}>
            <Typography variant="h4" component="h1" gutterBottom>
                Understanding Politics and Elections
            </Typography>

            <Stack spacing={3}>
                {/* Politics Section */}
                <Card>
                    <CardContent>
                        <Typography variant="h5" component="div">
                        How Politics Works
                        </Typography>
                        <Divider sx={{ my: 2 }} />
                        <Typography variant="body2">
                        Politics involves the processes through which decisions are made for a community, society, or country. It encompasses the mechanisms by which leaders are elected, laws are created, and policies are implemented. Political systems can vary widely, including democracies, monarchies, and authoritarian regimes.
                        </Typography>
                    </CardContent>
                </Card>

                {/* Elections Section */}
                <Card>
                    <CardContent>
                        <Typography variant="h5" component="div">
                        How Elections Occur
                        </Typography>
                        <Divider sx={{ my: 2 }} />
                        <Typography variant="body2">
                        Elections are a method for choosing leaders and deciding on public policies. They typically involve candidates running for office, campaigning to gain support, and voters casting their ballots. The process ensures that the will of the people is reflected in government decisions. Key elements include voter registration, voting procedures, and the counting of votes.
                        </Typography>
                    </CardContent>
                </Card>

                {/* Voting Impact Section */}
                <Card>
                    <CardContent>
                        <Typography variant="h5" component="div">
                        How Voting Makes a Difference
                        </Typography>
                        <Divider sx={{ my: 2 }} />
                        <Typography variant="body2">
                        Voting is a fundamental way for individuals to influence the direction of their community and country. By voting, citizens can support candidates and policies that align with their values and needs. Voting ensures that diverse perspectives are considered in decision-making processes, contributing to a more representative and responsive government.
                        </Typography>
                    </CardContent>
                </Card>
            </Stack>
        </Box>
    </Layout>
  );
};

export default Education;
