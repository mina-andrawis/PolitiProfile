import React, { useState } from 'react';
import useBills from '../hooks/useBills';
import BillList from './billList';

const BillsPage = ({ policyArea }) => {
  const [page, setPage] = useState(1);
  const { bills, loading, error, totalPages } = useBills(policyArea, page);

  const handleNextPage = () => {
    if (page < totalPages) setPage(page + 1);
  };

  const handlePrevPage = () => {
    if (page > 1) setPage(page - 1);
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Bills List</h1>
      <BillList bills={bills} />

      <div className="flex justify-between mt-4">
        <button 
          onClick={handlePrevPage} 
          disabled={page === 1} 
          className="px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50"
        >
          Previous
        </button>

        <span>Page {page} of {totalPages}</span>

        <button 
          onClick={handleNextPage} 
          disabled={page === totalPages} 
          className="px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default BillsPage;
