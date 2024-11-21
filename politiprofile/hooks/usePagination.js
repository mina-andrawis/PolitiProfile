import { useState, useEffect } from 'react';

const usePagination = (initialPage = 1) => {
  const [page, setPage] = useState(initialPage);

  const handleNextPage = (totalPages) => {
    setPage((prevPage) => (prevPage < totalPages ? prevPage + 1 : prevPage));
  };

  const handlePrevPage = () => {
    setPage((prevPage) => (prevPage > 1 ? prevPage - 1 : prevPage));
  };

  return { page, setPage, handleNextPage, handlePrevPage };
};

export default usePagination;
