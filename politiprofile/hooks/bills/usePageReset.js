import { useEffect, useState } from 'react';

const usePageReset = (filterValues) => {
  const [page, setPage] = useState(1);

  useEffect(() => {
    setPage(1); // Reset to page 1 when filter values change
    console.log('Page reset to 1');
  }, [filterValues]);

  return [page, setPage];
};

export default usePageReset;
