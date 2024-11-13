import React from 'react';

const PolicyAreaFilter = ({ policyArea, setPolicyArea }) => {
  const policyAreas = [
    { value: '', label: 'All' },
    { value: 'Health', label: 'Health' },
    { value: 'Law', label: 'Law' },
    { value: 'Education', label: 'Education' },
    // Add more options as needed
  ];

  return (
    <div className="mb-4">
      <label className="block text-gray-700 font-semibold mb-2">Filter by Policy Area</label>
      <select
        value={policyArea}
        onChange={(e) => setPolicyArea(e.target.value)}
        className="p-2 border border-gray-300 rounded"
      >
        {policyAreas.map((area) => (
          <option key={area.value} value={area.value}>
            {area.label}
          </option>
        ))}
      </select>
    </div>
  );
};

export default PolicyAreaFilter;
