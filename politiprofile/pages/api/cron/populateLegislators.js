import { MongoClient } from "mongodb";
import fetch from "node-fetch";
import yaml from "js-yaml";

const uri = process.env.MONGO_URI;
const client = new MongoClient(uri);

export default async function handler(req, res) {
  if (req.method === "GET") {
    console.log("Cron job triggered: Fetching legislators from GitHub and updating MongoDB");

    try {
      // Connect to MongoDB
      await client.connect();
      const database = client.db("default");
      const collection = database.collection("legislators");

      // Fetch the YAML data from GitHub
      const githubURL = "https://raw.githubusercontent.com/unitedstates/congress-legislators/main/legislators-current.yaml";
      const response = await fetch(githubURL);

      if (!response.ok) {
        throw new Error(`Failed to fetch data from GitHub: ${response.statusText}`);
      }

      const yamlText = await response.text();
      const legislators = yaml.load(yamlText); 

      const bulkOperations = legislators.map((legislator) => ({
        updateOne: {
          filter: { bioguide_id: legislator.id.bioguide },
          update: { $set: legislator },
          upsert: true, // Insert if the document doesn't exist
        },
      }));

      const result = await collection.bulkWrite(bulkOperations);

      console.log(`Inserted: ${result.upsertedCount}, Updated: ${result.modifiedCount}`);

      res.status(200).json({ message: "Legislators updated successfully", result });
    } catch (error) {
      console.error("Error in retrieveLegislators API:", error.message);
      res.status(500).json({ error: "An error occurred while updating legislators." });
    } finally {
      await client.close();
    }
  } else {
    res.setHeader("Allow", ["GET"]);
    res.status(405).json({ message: "Method Not Allowed" });
  }
}
