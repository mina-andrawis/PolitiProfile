import { useEffect } from "react";
import { useRouter } from "next/router";

// This file redirects the user to the featured fighters page when they visit the root URL (default in Next.js).
export async function getServerSideProps() {
  return {
    redirect: {
      destination: "/featured-fighters",
      permanent: false, // Set to true if it's a permanent redirect (301)
    },
  };
}

export default function Index() {
  return null;
}