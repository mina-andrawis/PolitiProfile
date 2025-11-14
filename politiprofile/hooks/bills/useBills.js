import { useQuery } from '@tanstack/react-query';

const fetchBills = async ({ policyArea, page, limit }) => {
  console.log(`Fetching bills with policyArea: ${policyArea}, page: ${page}, limit: ${limit}`);

  const response = await fetch(`/api/bills/getBills?policyArea=${policyArea}&page=${page}&limit=${limit}`);

  if (!response.ok) {
    console.error("Response status:", response.status);
    console.error("Response status text:", response.statusText);
    console.error("Requested URL:", response.url);

    const errorDetails = await response.json().catch(() => null);
    console.error("Error details:", errorDetails);

    throw new Error(`Failed to fetch bills: ${response.statusText}`);
  }

  return response.json();
};

const useBills = (policyArea, page, limit = 30) => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['bills', policyArea, page, limit],
    queryFn: () => fetchBills({ policyArea, page, limit }),
  });

  return {
    bills: data?.bills || [],
    loading: isLoading,
    error: error?.message || null,
    totalPages: data?.totalPages || 1,
  };
};

export default useBills;
