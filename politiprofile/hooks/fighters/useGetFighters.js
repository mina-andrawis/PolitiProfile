import { useQuery } from '@tanstack/react-query';

const fetchFighters = async ({ state, page, limit, userTopics, sortBy }) => {
  console.log(`Fetching fighters with state: ${state}, page: ${page}, limit: ${limit}, userTopics: ${userTopics?.length || 0}`);

  const params = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
  });

  if (state) params.append('state', state);
  if (sortBy) params.append('sortBy', sortBy);
  if (userTopics && userTopics.length > 0) {
    params.append('userTopics', JSON.stringify(userTopics));
  }

  const url = `/api/fighters/getFighters?${params.toString()}`;
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

const useGetFighters = (state = '', page = 1, limit = 30, userTopics = null, sortBy = 'alignment') => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['fighters', state, page, limit, userTopics, sortBy],
    queryFn: () => fetchFighters({ state, page, limit, userTopics, sortBy }),
  });

  return {
    fighters: data?.fighters || [],
    loading: isLoading,
    error: error?.message || null,
    totalPages: data?.totalPages || 1,
  };
};

export default useGetFighters;
