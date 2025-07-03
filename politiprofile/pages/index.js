import Head from "next/head";
import Layout, { siteTitle } from "../components/layout";
import Link from "next/link";
import yaml from "js-yaml";
import FighterGrid from "../components/fighters/fighter-grid";
import fighters from "../helpers/mock-fighters";

export default function Home() {
  return (
    <Layout home>
      <Head>
        <title>{siteTitle}</title>
        <meta
          name="description"
          content="Connect with politicians and candidates that align with your ideals. Compare candidates for elections and discover insights on key political issues."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <section className="text-lg text-center">
        <p>
          Say hello to those who choose to fight the good fight.
        </p>
        <p>
          Support bold and populist purveyors of freedom who unapologetically oppose fascism, defend our democracy, and champion the rights of all people.
        </p>
      </section>
      <FighterGrid fighters={fighters} />
    </Layout>
  );
}


export async function getStaticProps() {
  let data = []; // Default fallback data

  try {
    const res = await fetch(
      `/api/fighers/getFighters.js`,
    );

    if (!res.ok) {
      console.error('Failed to fetch data:', res.statusText);
    } else {
      const yamlData = await res.text();
      data = yaml.load(yamlData);
    }
  } catch (error) {
    console.error('Error fetching data:', error);
  }

  return {
    props: { legislators: data }, // Pass the legislators data as props
    revalidate: 86400, // Revalidate the page once every 24 hours (86400 seconds)
  };
}
