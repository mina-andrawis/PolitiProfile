import { useEffect } from 'react';

const usePageReset = (filterValues, setPage) => {
  useEffect(() => {
    setPage(1); // Reset to page 1 when filter values change
    console.log('Page reset to 1');
  }, [filterValues, setPage]);
};

export default usePageReset;
