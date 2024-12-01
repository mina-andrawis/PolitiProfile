import React from 'react';
import topics from '../../helpers/topics';

const PolicyAreaFilter = ({ policyArea, setPolicyArea }) => {

  const policyAreas = [
    { value: '', label: 'All Policy Areas' },
    ...topics.map((topic) => ({ value: topic.name, label: topic.name }))
  ];


  return (
    <div className="mb-4">
      <label className="block text-primaryText font-semibold mb-2">Filter by Policy Area</label>
      <select
        value={policyArea}
        onChange={(e) => setPolicyArea(e.target.value)}
        className="p-2 border border-dark rounded text-secondary"
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
