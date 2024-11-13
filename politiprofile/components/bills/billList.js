import React from 'react';
import Link from "next/link";

const BillList = ({ bills }) => {
  if (!bills.length) {
    return <p>No bills found for the selected policy area.</p>;
  }

  return (
    <ul className="space-y-4">
      {bills.map((bill) => (
        <li key={bill.billId} className="p-4 border border-gray-300 rounded">
          <Link to={`/bills/${bill.billId}`} className="text-blue-600 hover:underline">
            <h3 className="text-lg font-semibold">{bill.title}</h3>
          </Link>
          <p className="text-sm text-gray-500">Policy Area: {bill.policyArea || 'N/A'}</p>
          <p className="text-sm text-gray-500">Bill Number: {bill.billNumber}</p>
        </li>
      ))}
    </ul>
  );
};

export default BillList;
