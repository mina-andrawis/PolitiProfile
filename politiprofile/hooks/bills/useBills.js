import { useEffect, useState } from 'react';

const useBills = (policyArea, page, limit = 30) => {
  const [bills, setBills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalPages, setTotalPages] = useState(1);

  useEffect (() => {
    page = 1;
  }, [policyArea]);

  useEffect(() => {
    const fetchBills = async () => {
      setLoading(true);
      try {
        console.log(`Fetching bills with policyArea: ${policyArea}, page: ${page}, limit: ${limit}`);
        
        const baseUrl =
        process.env.VERCEL_URL 
        ? `https://${process.env.VERCEL_URL}`
        : process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

        
        const response = await fetch(`${baseUrl}/api/bills/getBills?policyArea=${policyArea}&page=${page}&limit=${limit}`);
        
        if (!response.ok) {
          console.error("Response status:", response.status);
          console.error("Response status text:", response.statusText);
          console.error("Requested URL:", response.url);
          
          const errorDetails = await response.json().catch(() => null); // Handle JSON parsing errors
          console.error("Error details:", errorDetails);
          
          throw new Error(`Failed to fetch bills: ${response.statusText}`);
        }
        
        const data = await response.json();
        setBills(data.bills);
        setTotalPages(data.totalPages);
      } catch (err) {
        console.error("Fetch error:", err.message);
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
