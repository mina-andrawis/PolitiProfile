import Head from "next/head";
import Layout, { siteTitle } from "../components/layout";
import utilStyles from "../styles/utils.module.css";
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
      <section className={utilStyles.headingMd}>
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
  // Fetch the YAML data from GitHub
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_SITE_URL}/api/legislators`,
  );
  const yamlData = await res.text();
  const data = yaml.load(yamlData);

  return {
    props: { legislators: data }, // Pass the legislators data as props
    revalidate: 86400, // Revalidate the page once every 24 hours (86400 seconds)
  };
}
