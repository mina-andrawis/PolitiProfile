import { useEffect, useState } from 'react';

const useBills = (policyArea) => {
  const [bills, setBills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBills = async () => {
      setLoading(true);
      try {
        const response = await fetch(`/api/bills/getBills?policyArea=${policyArea}`);
        console.log("Response:", response);
        if (!response.ok) {
            console.error("Error status:", response.status);
            console.error("Error status:", policyArea);
            throw new Error(`Failed to fetch boolls: ${response.statusText}`);
          }
          
        const data = await response.json();
        console.log("Data:", data);
        setBills(data.bills);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchBills();
  }, [policyArea]);

  return { bills, loading, error };
};

export default useBills;
