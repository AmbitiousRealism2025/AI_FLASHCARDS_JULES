// src/components/CategoryFilter.tsx
'use client';

import React, { useMemo } from 'react';
import { useFlashcards } from '@/contexts/FlashcardContext';

const CategoryFilter: React.FC = () => {
  const { state, dispatch } = useFlashcards();
  const { allCards, currentFilter } = state;

  const uniqueCategories = useMemo(() => {
    const categories = new Set<string>();
    allCards.forEach(card => categories.add(card.category));
    return Array.from(categories).sort();
  }, [allCards]);

  const handleFilterChange = (category: string | null) => {
    dispatch({ type: 'SET_FILTER', payload: { filter: category } });
  };

  const baseChipStyle = "px-4 py-2 m-1 text-sm font-medium rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-opacity-75 cursor-pointer transition-colors duration-150";
  const activeChipStyle = "bg-blue-600 text-white ring-blue-500";
  const inactiveChipStyle = "bg-white text-blue-700 hover:bg-blue-100 ring-blue-300";

  return (
    <div className="mb-8 flex flex-wrap justify-center items-center">
      <button
        onClick={() => handleFilterChange(null)}
        className={`${baseChipStyle} ${!currentFilter ? activeChipStyle : inactiveChipStyle}`}
        aria-pressed={!currentFilter}
      >
        All
      </button>
      {uniqueCategories.map(category => (
        <button
          key={category}
          onClick={() => handleFilterChange(category)}
          className={`${baseChipStyle} ${currentFilter === category ? activeChipStyle : inactiveChipStyle}`}
          aria-pressed={currentFilter === category}
        >
          {category}
        </button>
      ))}
    </div>
  );
};

export default CategoryFilter;
