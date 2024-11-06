// src/hooks/useLegislatorsByState.js

import { useEffect, useState } from "react";
import { stateNames } from "../helpers/enums"; // Assuming the enums are stored in helpers

const useLegislatorsByState = () => {
  const [legislatorsByState, setLegislatorsByState] = useState({});
  const [expandedStates, setExpandedStates] = useState({});
  const [sortedStates, setSortedStates] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLegislators = async () => {
      try {
        const response = await fetch("/api/retrieveLegislators");
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

        // Sort states alphabetically by their full name
        const states = Object.keys(groupedByState).sort((a, b) => {
          const stateA = stateNames[a] || a; // Fallback to abbreviation if name not found
          const stateB = stateNames[b] || b;
          return stateA.localeCompare(stateB);
        });

        setSortedStates(states);
      } catch (err) {
        setError("Error fetching data");
      }
    };

    fetchLegislators();
  }, []);

  // Function to toggle the expanded state for a given state abbreviation
  const toggleState = (stateAbbreviation) => {
    setExpandedStates((prev) => ({
      ...prev,
      [stateAbbreviation]: !prev[stateAbbreviation],
    }));
  };

  return {
    legislatorsByState,
    expandedStates,
    sortedStates,
    toggleState,
    error,
  };
};

export default useLegislatorsByState;
