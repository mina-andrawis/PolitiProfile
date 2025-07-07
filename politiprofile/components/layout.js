import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import NavBar from "./navigation/navbar";
import ThemeToggle from "./theme-toggle";

const name = "PolitiProfile";
export const siteTitle = "PolitiProfile";

export default function Layout({ children, home }) {
  return (
    <div className="w-full max-w-5xl px-4 sm:px-12 lg:px-16 my-12 mx-auto text-primary-text overflow-x-hidden">
      <Head>
        <meta
          name="description"
          content="Connect with politicians and candidates that align with your ideals. Compare candidates for elections and discover insights on key political issues."
        />
      </Head>
      <header className="flex flex-col items-center">
      </header>

      <div className="hidden sm:flex justify-end px-9">
          <ThemeToggle />
      </div>
      <NavBar />
      
      <main>{children}</main>
      {!home && (
        <div className="mt-12">
          <Link href="/featured-fighters">← Back to home</Link>
        </div>
      )}
    </div>
  );
}
