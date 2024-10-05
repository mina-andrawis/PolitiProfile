// src/pages/congress-list.js

import useLegislatorsByState from "../hooks/useLegislatorsByState";
import { stateNames, chamber } from "../helpers/enums";
import Date from "../helpers/date";

const CongressList = () => {
  const {
    legislatorsByState,
    expandedStates,
    sortedStates,
    toggleState,
    error,
  } = useLegislatorsByState(); // Destructure values returned from the custom hook

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="p-4">
      <h1 className="mt-10 text-center text-5xl font-bold">
        Your Current Legislators
      </h1>
      <h2 className="mb-10 mt-2 text-center font-bold">Updated Every 24 Hours</h2>

      {sortedStates.map((stateAbbreviation) => (
        <div key={stateAbbreviation} className="mb-6">
          {/* State name with clickable functionality to expand/collapse */}
          <h2
            className="mx-48 mb-2 cursor-pointer border-b border-gray-300 text-center text-3xl font-semibold"
            onClick={() => toggleState(stateAbbreviation)}
          >
            {stateNames[stateAbbreviation] || stateAbbreviation}
          </h2>

          {/* Conditionally render legislators list based on expandedStates */}
          {expandedStates[stateAbbreviation] && (
            <ul className="list-none">
              {Array.isArray(legislatorsByState[stateAbbreviation]) &&
                legislatorsByState[stateAbbreviation].map(
                  (legislator, index) => {
                    const lastTerm =
                      legislator.terms[legislator.terms.length - 1];
                    return (
                      <li
                        key={index}
                        className="mx-56 mb-5 rounded-lg bg-gray-100 p-2 text-center text-lg shadow-md"
                      >
                        <p>
                          <strong>Name:</strong> {legislator.name.first}{" "}
                          {legislator.name.last}
                        </p>
                        <p>
                          <strong>Party:</strong> {lastTerm.party}
                        </p>
                        <p>
                          <strong>State:</strong>{" "}
                          {stateNames[stateAbbreviation] || lastTerm.state}
                        </p>
                        <p>
                          <strong>Chamber:</strong> {chamber[lastTerm.type]}
                        </p>
                        <p>
                          <strong>End of Term:</strong>{" "}
                          {<Date dateString={lastTerm.end} />}
                        </p>
                      </li>
                    );
                  }
                )}
            </ul>
          )}
        </div>
      ))}
    </div>
  );
};

export default CongressList;
