import React, { useState } from 'react';
import BillList from '../components/bills/billList';
import PolicyAreaFilter from '../components/bills/policyAreaFilter';
import useBills from '../hooks/bills/useBills';
import Layout from '../components/layout';

const BillListPage = () => {
  const [policyArea, setPolicyArea] = useState('');
  const [page, setPage] = useState(1); // New state to track the current page
  const { bills, loading, error, totalPages } = useBills(policyArea, page); // Pass page to useBills

  // Handlers for pagination controls
  const handleNextPage = () => {
    if (page < totalPages) setPage(page + 1);
  };

  const handlePrevPage = () => {
    if (page > 1) setPage(page - 1);
  };

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
          </>
        )}
      </div>
    </Layout>
  );
};

export default BillListPage;
