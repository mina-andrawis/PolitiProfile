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




