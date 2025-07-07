import React from 'react'
import FighterCard from './fighter-card'

const FighterGrid = ({ fighters }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-4 gap-6 px-4 lg:px-0">
      {fighters.map((fighter) => (
        <FighterCard key={fighter.name} fighter={fighter} />
      ))}
    </div>
  )
}

export default FighterGrid
