import React from 'react'
import FighterCard from './fighter-card'

const FighterGrid = ({ fighters }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 xl:grid-cols-3 gap-6">
      {fighters.map((fighter) => (
        <FighterCard key={fighter.name} fighter={fighter} />
      ))}
    </div>
  )
}

export default FighterGrid
