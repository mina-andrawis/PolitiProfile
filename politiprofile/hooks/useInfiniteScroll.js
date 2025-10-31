// hooks/useInfiniteScroll.js
import { useEffect, useRef } from "react";

/**
 * Fires onLoadMore when the sentinel enters the viewport.
 */
export default function useInfiniteScroll({
  hasMore,
  loading,
  onLoadMore,
  rootMargin = "800px 0px 800px 0px",
}) {
  const sentinelRef = useRef(null);

  useEffect(() => {
    const el = sentinelRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const first = entries[0];
        if (first?.isIntersecting && hasMore && !loading) onLoadMore?.();
      },
      { rootMargin }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [hasMore, loading, onLoadMore, rootMargin]);

  return sentinelRef;
}
