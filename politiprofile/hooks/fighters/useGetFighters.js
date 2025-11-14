import { useQuery } from '@tanstack/react-query';

const fetchFighters = async ({ state, page, limit }) => {
  console.log(`Fetching fighters with state: ${state}, page: ${page}, limit: ${limit}`);

  const url = `/api/fighters/getFighters?${state ? `state=${state}&` : ''}page=${page}&limit=${limit}`;
  const response = await fetch(url);

  if (!response.ok) {
    console.error("Response status:", response.status);
    console.error("Response status text:", response.statusText);
    console.error("Requested URL:", response.url);

    const errorDetails = await response.json().catch(() => null);
    console.error("Error details:", errorDetails);

    throw new Error(`Failed to fetch fighters: ${response.statusText}`);
  }

  return response.json();
};

const useGetFighters = (state, page, limit = 30) => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['fighters', state, page, limit],
    queryFn: () => fetchFighters({ state, page, limit }),
  });

  return {
    fighters: data?.fighters || [],
    loading: isLoading,
    error: error?.message || null,
    totalPages: data?.totalPages || 1,
  };
};

export default useGetFighters;
