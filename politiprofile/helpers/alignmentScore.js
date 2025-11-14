/**
 * Calculate alignment score between a user's topic preferences and a fighter's topic positions
 *
 * Algorithm:
 * 1. For each topic the user cares about:
 *    - If fighter SUPPORTS it: add points based on priority (high=10, medium=6, low=3)
 *    - If fighter has NO POSITION: add half points (high=5, medium=3, low=1.5)
 *    - If fighter OPPOSES it: subtract points (high=-10, medium=-6, low=-3)
 *    - If fighter is NEUTRAL: no points
 * 2. Normalize to 0-100 scale
 *
 * @param {Array<string>} userTopics - Array of topic names the user cares about
 * @param {Object} fighterTopicPositions - Object mapping topic names to {stance, priority}
 * @returns {number} - Alignment score from 0-100
 */
export function calculateAlignment(userTopics, fighterTopicPositions) {
  if (!userTopics || userTopics.length === 0) {
    return 0; // No topics selected = no alignment
  }

  if (!fighterTopicPositions || Object.keys(fighterTopicPositions).length === 0) {
    return 0; // Fighter has no positions = no alignment
  }

  const priorityWeights = {
    high: 10,
    medium: 6,
    low: 3
  };

  let totalScore = 0;
  let maxPossibleScore = 0;

  // Calculate score for each user topic
  userTopics.forEach(topic => {
    const position = fighterTopicPositions[topic];

    if (!position) {
      // Fighter hasn't taken a position on this topic
      // Treat as neutral - no points added or subtracted
      maxPossibleScore += priorityWeights.high; // Still count toward max possible
      return;
    }

    const weight = priorityWeights[position.priority] || priorityWeights.low;
    maxPossibleScore += priorityWeights.high; // Max possible is always high priority

    switch (position.stance) {
      case 'support':
        // Fighter supports a topic the user cares about - full points
        totalScore += weight;
        break;
      case 'no-position':
        // Fighter hasn't decided - half points (better than opposition)
        totalScore += weight * 0.5;
        break;
      case 'neutral':
        // Fighter is explicitly neutral - no points
        break;
      case 'oppose':
        // Fighter opposes a topic the user cares about - negative points
        totalScore -= weight;
        break;
      default:
        // Unknown stance - treat as neutral
        break;
    }
  });

  // Normalize to 0-100 scale
  if (maxPossibleScore === 0) {
    return 0;
  }

  // Add offset to prevent negative scores and normalize
  const minPossibleScore = -maxPossibleScore; // All oppositions
  const normalizedScore = ((totalScore - minPossibleScore) / (maxPossibleScore - minPossibleScore)) * 100;

  // Round to nearest integer
  return Math.round(Math.max(0, Math.min(100, normalizedScore)));
}

/**
 * Calculate alignment scores for multiple fighters
 *
 * @param {Array<string>} userTopics - User's selected topics
 * @param {Array<Object>} fighters - Array of fighter objects with topicPositions
 * @returns {Array<Object>} - Fighters with calculated alignmentScore field
 */
export function calculateAlignmentForFighters(userTopics, fighters) {
  return fighters.map(fighter => ({
    ...fighter,
    alignmentScore: calculateAlignment(userTopics, fighter.topicPositions)
  }));
}

/**
 * Sort fighters by alignment score (highest first)
 *
 * @param {Array<Object>} fighters - Array of fighters with alignmentScore
 * @returns {Array<Object>} - Sorted fighters
 */
export function sortByAlignment(fighters) {
  return [...fighters].sort((a, b) => (b.alignmentScore || 0) - (a.alignmentScore || 0));
}

export default {
  calculateAlignment,
  calculateAlignmentForFighters,
  sortByAlignment
};
