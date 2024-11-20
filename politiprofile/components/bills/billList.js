import React from 'react';
import Link from 'next/link';
import formatSummary from '../../helpers/formatSummary';

const BillList = ({ bills }) => {
  if (!bills || !bills.length) {
    return <p className="text-center text-gray-500 mt-8">No bills found for the selected policy area.</p>;
  }

  return (
    <>
      <h2 className="text-center text-2xl font-bold mb-4">118th Congress</h2>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {bills.map((bill) => (
          <Link key={bill.billId} href={`/bills/${bill.billId}`} passHref>
            <div
              className="cursor-pointer bg-white shadow-md rounded-lg px-6 py-2 hover:shadow-lg transition-shadow border border-gray-200 flex flex-col justify-between min-h-[300px]"
            >
              <div>
                <h3 className="text-secondary hover:underline text-lg font-semibold mb-2">
                  {bill.title || 'Untitled Bill'}
                </h3>
                <p className="text-sm text-gray-500 mb-1">Policy Area: {bill.policyArea || 'N/A'}</p>
                <p className="text-sm text-gray-500 mb-4">Bill Number: {bill.billNumber}</p>

                {bill.summaries && bill.summaries[0] && (
                  <p className="text-gray-700 text-sm mt-2 line-clamp-4">
                    <span className="font-semibold">{formatSummary(bill.summaries[0])}</span>
                  </p>
                )}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </>
  );
};

export default BillList;
