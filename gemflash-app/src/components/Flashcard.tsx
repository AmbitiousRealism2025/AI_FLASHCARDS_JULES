// src/components/Flashcard.tsx
'use client';

import React, { useState } from 'react';
import { motion, MotionProps } from 'framer-motion';
import type { Flashcard as FlashcardType } from '@/data/mockData';

interface FlashcardProps extends MotionProps {
  card: FlashcardType;
  onCardClick?: () => void; // Optional: if you still want to toggle reveal on click separately from drag
}

const Flashcard: React.FC<FlashcardProps> = React.forwardRef<HTMLDivElement, FlashcardProps>(
  ({ card, onCardClick, ...motionProps }, ref) => {
    const [isRevealed, setIsRevealed] = useState(false);

    const handleCardClick = () => {
      setIsRevealed(!isRevealed);
      if (onCardClick) {
        onCardClick();
      }
    };

    return (
      <motion.div
        ref={ref}
        className="absolute w-80 h-96 p-6 border border-gray-300 rounded-lg shadow-xl cursor-grab bg-white flex flex-col justify-center items-center text-center"
        onClick={handleCardClick} // Toggle reveal on click
        {...motionProps} // Spread motion props for drag, variants, etc.
        whileTap={{ cursor: "grabbing" }}
      >
        <h2 className="text-2xl font-bold mb-4 select-none">{card.term}</h2>
        {isRevealed && (
          <>
            <p className="text-gray-700 mb-2 select-none">{card.definition}</p>
            {card.example && (
              <p className="text-sm text-gray-500 italic select-none">Example: {card.example}</p>
            )}
          </>
        )}
        {!isRevealed && (
           <p className="text-sm text-gray-400 mt-4 select-none">(Click to reveal)</p>
        )}
        {isRevealed && onGenerateChallenge && (
          <button
            onClick={(e) => {
              e.stopPropagation(); // Prevent card click event
              onGenerateChallenge();
            }}
            className="mt-4 px-4 py-2 bg-blue-500 text-white text-sm rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-300"
          >
            Generate Challenge
          </button>
        )}
      </motion.div>
    );
  }
);

Flashcard.displayName = 'Flashcard';

export default Flashcard;
