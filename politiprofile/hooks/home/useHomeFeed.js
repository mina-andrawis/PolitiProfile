// hooks/useHomeFeed.js
import { useCallback, useEffect, useState } from "react";

/**
 * Generic home feed loader. Pass in your fetcher.
 *   fetchFeed(page, filters) -> { items: FeedItem[], hasMore: boolean }
 */
export default function useHomeFeed(filters, fetchFeed) {
  const [page, setPage] = useState(1);
  const [items, setItems] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const loadPage = useCallback(
    async (nextPage) => {
      if (loading || !hasMore) return;
      try {
        setLoading(true);
        const res = await fetchFeed(nextPage, filters);
        setItems((prev) => (nextPage === 1 ? res.items : [...prev, ...res.items]));
        setHasMore(res.hasMore);
        setPage(nextPage);
        setError(null);
      } catch (e) {
        setError(e?.message || "Failed to load feed");
      } finally {
        setLoading(false);
      }
    },
    [filters, loading, hasMore, fetchFeed]
  );

  // Reset on filter changes
  useEffect(() => {
    setItems([]);
    setHasMore(true);
    loadPage(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters.sort, JSON.stringify(filters.issues), JSON.stringify(filters.types)]);

  return {
    items,
    hasMore,
    loading,
    error,
    loadMore: () => loadPage(page + 1),
    reload: () => loadPage(1),
  };
}
