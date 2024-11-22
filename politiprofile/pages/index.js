import Head from "next/head";
import Layout, { siteTitle } from "../components/layout";
import Link from "next/link";
import CongressList from "../components/congress-list";
import yaml from "js-yaml";

export default function Home({ legislators }) {
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
          Connect with politicians and candidates that align with your ideals.
          Compare candidates for elections and discover insights on key
          political issues.
        </p>
      </section>

      <CongressList legislators={legislators} />
    </Layout>
  );
}


export async function getStaticProps() {
  const baseUrl =
    process.env.NEXT_PUBLIC_BASE_URL ||
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000');

  try {
    const res = await fetch(`/api/retrieveLegislators`);

    if (!res.ok) {
      console.error('Failed to fetch data:', res.statusText);
      return { notFound: true }; // Handle API errors by rendering a 404 page
    }

    const yamlData = await res.text();
    const data = yaml.load(yamlData);

    return {
      props: { legislators: data }, // Pass the legislators data as props
      revalidate: 86400, // Revalidate the page once every 24 hours (86400 seconds)
    };
  } catch (error) {
    console.error('Error fetching legislators:', error.message);
    return { notFound: true }; // Handle fetch failure by rendering a 404 page
  }
}
}
