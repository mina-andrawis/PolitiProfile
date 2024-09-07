import { useEffect, useState } from 'react';

const CongressList = () => {
  const [legislators, setLegislators] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLegislators = async () => {
      try {
        const response = await fetch('/api/legislators');
        const data = await response.json();
        setLegislators(data);
      } catch (err) {
        setError('Error fetching data');
      }
    };

    fetchLegislators();
  }, []);

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Current Congress Legislators</h1>
      <ul className="list-none">
        {legislators.map((legislator, index) => (
          <li key={index} className="p-2 mb-2 bg-gray-100 rounded-lg shadow-md">
            <p>
              <strong>Name:</strong> {legislator.name.first} {legislator.name.last}
            </p>
            <p>
              <strong>Party:</strong> {legislator.terms[legislator.terms.length - 1].party}
            </p>
            <p>
              <strong>State:</strong> {legislator.terms[legislator.terms.length - 1].state}
            </p>
            <p>
              <strong>Office:</strong> {legislator.terms[legislator.terms.length - 1].office}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CongressList;
