import React, { useState, useEffect } from 'react';
import BillList from '../../components/bills/billList';
import PolicyAreaFilter from '../../components/bills/policyAreaFilter';
import useBills from '../../hooks/bills/useBills';
import Layout from '../../components/layout';
import usePagination from '../../hooks/usePagination';

const Bills = () => {
  const [policyArea, setPolicyArea] = useState('');
  
  // Use pagination hook
  const { page, setPage, handleNextPage, handlePrevPage } = usePagination();

  // Fetch bills data with the current page and policy area
  const { bills, loading, error, totalPages } = useBills(policyArea, page);

  // Reset page to 1 whenever policyArea changes
  useEffect(() => {
    setPage(1);
  }, [policyArea]);

  return (
    <Layout>
      <div className="p-6">
        <PolicyAreaFilter policyArea={policyArea} setPolicyArea={setPolicyArea} />

        {loading ? (
          <p>Loading...</p>
        ) : error ? (
          <p className="text-red-500">Error: {error}</p>
        ) : (
          <>
            <BillList bills={bills} />

            {/* Pagination Controls */}
            <div className="flex justify-between items-center mt-4">
              <button
                onClick={handlePrevPage}
                disabled={page === 1}
                className="px-4 py-2 bg-secondary text-white rounded disabled:opacity-50"
              >
                Previous
              </button>

              <span>Page {page} of {totalPages}</span>

              <button
                onClick={() => handleNextPage(totalPages)}
                disabled={page === totalPages}
                className="px-4 py-2 bg-secondary text-white rounded disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </>
        )}
      </div>
    </Layout>
  );
};

export default Bills;
