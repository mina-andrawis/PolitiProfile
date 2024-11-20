import { useEffect, useState } from 'react';

const usePageReset = (policyArea) => {
  const [page, setPage] = useState(1);
  
  useEffect(() => {
    setPage(1);
  }, [policyArea]);

  return [page, setPage];
};

export default usePageReset;
