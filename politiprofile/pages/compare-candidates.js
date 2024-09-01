import React from 'react';
import { Card, CardContent, Typography, Grid, Divider, CardMedia, Box, Container } from '@mui/material';
import Layout from '../components/layout';

const candidate1 = {
  name: "Jane Doe",
  party: "Progressive Party",
  bio: "Jane has been a champion for environmental issues and social justice. She has a background in law and has worked on numerous policy reforms.",
  image: "https://via.placeholder.com/150"
};

const candidate2 = {
  name: "John Smith",
  party: "Conservative Party",
  bio: "John is known for his focus on economic development and national security. With a background in business, he brings a pragmatic approach to governance.",
  image: "https://via.placeholder.com/150"
};

const CandidateComparison = () => {
  return (
    <Layout>
      <Box sx={{ flexGrow: 1, p: 2, my:3}}>
            <Card sx={{p:4, my: 1}}>
              <CardMedia
                component="img"
                height="140"
                image={candidate1.image}
                alt={`${candidate1.name}'s photo`}
              />
              <CardContent>
                <Typography variant="h5" component="div">
                  {candidate1.name}
                </Typography>
                <Typography variant="subtitle1" color="text.secondary">
                  {candidate1.party}
                </Typography>
                <Divider sx={{ my: 2 }} />
                <Typography variant="body2">
                  {candidate1.bio}
                </Typography>
              </CardContent>
            </Card>
            <Card sx={{p:4, my: 1}}>
              <CardMedia
                component="img"
                height="140"
                image={candidate2.image}
                alt={`${candidate2.name}'s photo`}
              />
              <CardContent>
                <Typography variant="h5" component="div">
                  {candidate2.name}
                </Typography>
                <Typography variant="subtitle1" color="text.secondary">
                  {candidate2.party}
                </Typography>
                <Divider sx={{ my: 2 }} />
                <Typography variant="body2">
                  {candidate2.bio}
                </Typography>
              </CardContent>
            </Card>
      </Box>
    </Layout>
  );
};

export default CandidateComparison;