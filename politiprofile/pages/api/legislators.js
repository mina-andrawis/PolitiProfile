// pages/api/legislators.js
import axios from 'axios';
import yaml from 'js-yaml';

export default async function handler(req, res) {
  try {
    const response = await axios.get(
      'https://raw.githubusercontent.com/unitedstates/congress-legislators/main/legislators-current.yaml'
    );
    const data = yaml.load(response.data);

    // Return the parsed data as JSON
    res.status(200).json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching legislators data' });
  }
}
