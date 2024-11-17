import { useEffect, useState } from 'react';

const useBills = (policyArea, page = 1, limit = 50) => {
  const [bills, setBills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const fetchBills = async () => {
      setLoading(true);
      try {
        const response = await fetch(`/api/bills/getBills?policyArea=${policyArea}&page=${page}&limit=${limit}`);
        if (!response.ok) throw new Error(`Failed to fetch bills: ${response.statusText}`);
        
        const data = await response.json();
        setBills(data.bills);
        setTotalPages(data.totalPages);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchBills();
  }, [policyArea, page, limit]);

  return { bills, loading, error, totalPages };
};

export default useBills;
