import { useEffect, useState } from 'react';
import { stateNames, chamber } from '../helpers/enums';  // Adjust path if needed
import Date from '../helpers/date';

const CongressList = () => {
  const [legislatorsByState, setLegislatorsByState] = useState({});
  const [expandedStates, setExpandedStates] = useState({});
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLegislators = async () => {
      try {
        const response = await fetch('/api/legislators');
        const data = await response.json();

        // Group legislators by state
        const groupedByState = data.reduce((acc, legislator) => {
          const lastTerm = legislator.terms[legislator.terms.length - 1];
          const state = lastTerm.state;

          if (!acc[state]) {
            acc[state] = [];
          }

          acc[state].push(legislator);
          return acc;
        }, {});

        setLegislatorsByState(groupedByState);
      } catch (err) {
        setError('Error fetching data');
      }
    };

    fetchLegislators();
  }, []);

  if (error) {
    return <div>{error}</div>;
  }

  // Toggle the state expansion
  const toggleState = (stateAbbreviation) => {
    setExpandedStates((prev) => ({
      ...prev,
      [stateAbbreviation]: !prev[stateAbbreviation],  // Toggle state expansion
    }));
  };

  // Get the state abbreviations and sort them alphabetically based on the full state name
  const sortedStates = Object.keys(legislatorsByState).sort((a, b) => {
    const stateA = stateNames[a] || a;  // Fallback to abbreviation if name not found
    const stateB = stateNames[b] || b;
    return stateA.localeCompare(stateB);
  });

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Current Congress Legislators</h1>

      {sortedStates.map((stateAbbreviation) => (
        <div key={stateAbbreviation} className="mb-6">
          {/* State name with clickable functionality to expand/collapse */}
          <h2
            className="text-lg font-semibold mb-2 cursor-pointer"
            onClick={() => toggleState(stateAbbreviation)}
          >
            {stateNames[stateAbbreviation] || stateAbbreviation}
          </h2>

          {/* Conditionally render legislators list based on expandedStates */}
          {expandedStates[stateAbbreviation] && (
            <ul className="list-none">
              {Array.isArray(legislatorsByState[stateAbbreviation]) &&
                legislatorsByState[stateAbbreviation].map((legislator, index) => {
                  const lastTerm = legislator.terms[legislator.terms.length - 1];
                  return (
                    <li key={index} className="p-2 mb-2 bg-gray-100 rounded-lg shadow-md">
                      <p>
                        <strong>Name:</strong> {legislator.name.first} {legislator.name.last}
                      </p>
                      <p>
                        <strong>Party:</strong> {lastTerm.party}
                      </p>
                      <p>
                        <strong>State:</strong> {stateNames[stateAbbreviation] || lastTerm.state}
                      </p>
                      <p>
                        <strong>Chamber:</strong> {chamber[lastTerm.type]}
                      </p>
                      <p>
                      <strong>End of Term:</strong> {<Date dateString={lastTerm.end} />}
                      </p>
                    </li>
                  );
                })}
            </ul>
          )}
        </div>
      ))}
    </div>
  );
};

export default CongressList;
