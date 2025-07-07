import { useEffect } from "react";
import { useRouter } from "next/router";

// This file redirects the user to the featured fighters page when they visit the root URL (default in Next.js).
export default function Index() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/featured-fighters");
  }, [router]);

  return null; // Nothing to render while redirecting
}