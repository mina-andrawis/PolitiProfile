import React, { useState } from 'react';
import BillList from '../components/bills/billList';
import PolicyAreaFilter from '../components/bills/policyAreaFilter';
import useBills from '../hooks/bills/useBills';
import Layout from '../components/layout';

const BillListPage = () => {
  const [policyArea, setPolicyArea] = useState('');
  const { bills, loading, error } = useBills(policyArea);

  return (
    <Layout>

    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-4">Bills List</h1>
      <PolicyAreaFilter policyArea={policyArea} setPolicyArea={setPolicyArea} />
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p className="text-red-500">Error: {error}</p>
      ) : (
        <BillList bills={bills} />
      )}
    </div>
    </Layout>
  );
};

export default BillListPage;
