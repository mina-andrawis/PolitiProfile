import React from 'react';
import formatSummary from '../../helpers/formatSummary';

const BillList = ({ bills }) => {
  if (!bills || !bills.length) {
    return <p className="text-center text-gray-500 mt-8">No bills found for the selected policy area.</p>;
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {bills.map((bill) => (
        <div
          key={bill.billId}
          className="bg-white shadow-md rounded-lg p-6 hover:shadow-lg transition-shadow border border-gray-200"
        >
          <h3 className="text-blue-600 hover:underline text-lg font-semibold mb-2">
            {bill.title || 'Untitled Bill'}
          </h3>
          <p className="text-sm text-gray-500 mb-1">Policy Area: {bill.policyArea || 'N/A'}</p>
          <p className="text-sm text-gray-500 mb-4">Bill Number: {bill.billNumber}</p>

          {bill.summaries && bill.summaries[0] && (
            <p className="text-gray-700 text-sm mt-2 line-clamp-4">
              <span className="font-semibold">Summary:</span> {formatSummary(bill.summaries[0])}
            </p>
          )}
        </div>
      ))}
    </div>
  );
};

export default BillList;
