import { useEffect, useState } from 'react';

const useFighters = (state, initialPage, limit = 30) => {
  const [fighters, setFighters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(initialPage);

  // Reset page when state filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [state]);

  useEffect(() => {
    const fetchFighters = async () => {
      setLoading(true);
      try {
        console.log(`Fetching fighters with state: ${state}, page: ${currentPage}, limit: ${limit}`);

        const url = `/api/fighters/getFighters?${state ? `state=${state}&` : ''}page=${currentPage}&limit=${limit}`;
        const response = await fetch(url);

        if (!response.ok) {
          console.error("Response status:", response.status);
          console.error("Response status text:", response.statusText);
          console.error("Requested URL:", response.url);

          const errorDetails = await response.json().catch(() => null);
          console.error("Error details:", errorDetails);

          throw new Error(`Failed to fetch fighters: ${response.statusText}`);
        }

        const data = await response.json();
        setFighters(data.fighters || []);
        setTotalPages(data.totalPages || 1);
      } catch (err) {
        console.error("Fetch error:", err.message);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchFighters();
  }, [state, page, limit]);

  return { fighters, loading, error, totalPages };
};

export default useFighters;
