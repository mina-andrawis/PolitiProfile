import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import NavBar from "./navigation/navbar";

const name = "PolitiProfile";
export const siteTitle = "PolitiProfile";

export default function Layout({ children, home }) {
  return (
    <div className="max-w-4xl px-6 my-12 mx-auto">
      <Head>
        <meta
          name="description"
          content="Connect with politicians and candidates that align with your ideals. Compare candidates for elections and discover insights on key political issues."
        />
      </Head>
      <header className="flex flex-col items-center">
        <h1 className="text-5xl text-center font-bold font-mono mb-3">{name}</h1>
      </header>

      <NavBar />
      
      <main>{children}</main>
      {!home && (
        <div className="mt-12">
          <Link href="/">← Back to home</Link>
        </div>
      )}
    </div>
  );
}
