// src/contexts/FlashcardContext.tsx
import React, { createContext, useReducer, useContext, ReactNode, Dispatch, useEffect } from 'react';
import { flashcards as mockFlashcards, Flashcard as FlashcardType, Badge as BadgeType } from '@/data/mockData';

// 1. Define LocalStorage Key
const GEMFLASH_STATE_KEY = 'gemFlash.appState';

// -- Persisted State Shape -- (Define what part of AppState is stored)
export interface PersistedState {
  cardStatuses: CardStatus[];
  earnedBadges: string[];
  currentFilter?: string | null; // Optional, if you decide to persist it
}

// 1. Define State and Actions

// -- STATE SHAPE --
export interface CardStatus {
  cardId: string;
  status: 'unseen' | 'review' | 'understood';
}

export interface AppState {
  allCards: FlashcardType[]; // Keep a copy of all card data for easy lookup
  cardStatuses: CardStatus[];
  earnedBadges: string[]; // Store badge IDs
  currentFilter: string | null;
  cardStats: {
    understoodCount: number;
    reviewCount: number;
    unseenCount: number;
  };
}

// -- ACTION TYPES --
export type Action =
  | { type: 'LOAD_CARDS'; payload: FlashcardType[] }
  | { type: 'MARK_UNDERSTOOD'; payload: { cardId: string } }
  | { type: 'MARK_REVIEW'; payload: { cardId: string } }
  | { type: 'SET_FILTER'; payload: { filter: string | null } }
  | { type: 'AWARD_BADGE'; payload: { badgeId: string } }
  | { type: 'RESET_PROGRESS' };


// Helper function to calculate stats
const calculateStats = (cardStatuses: CardStatus[]) => {
  return cardStatuses.reduce(
    (acc, cs) => {
      if (cs.status === 'understood') acc.understoodCount++;
      else if (cs.status === 'review') acc.reviewCount++;
      else acc.unseenCount++;
      return acc;
    },
    { understoodCount: 0, reviewCount: 0, unseenCount: 0 }
  );
};

// Initial state calculation
const initialCardStatuses: CardStatus[] = mockFlashcards.map(card => ({
  cardId: card.id,
  status: 'unseen',
}));

const initialState: AppState = {
  allCards: [...mockFlashcards],
  cardStatuses: initialCardStatuses,
  earnedBadges: [],
  currentFilter: null,
  cardStats: calculateStats(initialCardStatuses),
};


// Function to load state from localStorage
const loadState = (): AppState => {
  try {
    const serializedState = localStorage.getItem(GEMFLASH_STATE_KEY);
    if (serializedState === null) {
      console.log("No persisted state found, using default initial state.");
      return initialState;
    }
    const storedPersistedState: PersistedState = JSON.parse(serializedState);

    // Reconstruct AppState from persisted data and mockFlashcards
    // Ensure allCards from mockData is the source of truth for card content
    const allCardsFromMock = [...mockFlashcards];
    let validCardStatuses = storedPersistedState.cardStatuses || [];

    // Validate and merge card statuses
    // Ensure every card from allCardsFromMock has a status entry
    const currentCardIds = new Set(allCardsFromMock.map(c => c.id));
    validCardStatuses = validCardStatuses.filter(cs => currentCardIds.has(cs.cardId)); // Remove statuses for old/deleted cards

    const statusesFromStorage = new Map(validCardStatuses.map(cs => [cs.cardId, cs.status]));
    const finalCardStatuses: CardStatus[] = allCardsFromMock.map(card => ({
      cardId: card.id,
      status: statusesFromStorage.get(card.id) || 'unseen',
    }));
    
    const loadedState: AppState = {
      allCards: allCardsFromMock,
      cardStatuses: finalCardStatuses,
      earnedBadges: storedPersistedState.earnedBadges || [],
      currentFilter: storedPersistedState.currentFilter !== undefined ? storedPersistedState.currentFilter : null,
      cardStats: calculateStats(finalCardStatuses),
    };
    console.log("Successfully loaded state from localStorage:", loadedState);
    return loadedState;

  } catch (error) {
    console.error("Could not load state from localStorage, using default initial state:", error);
    return initialState; // Fallback to default initial state if error
  }
};


import { badgeThresholds } from '@/data/mockData'; // Import badge thresholds

// Function to check and award badges
// This function needs the current state (AppState) and dispatch function.
// It's not a reducer itself but is called by the reducer or related logic.
const checkAndAwardBadges = (currentState: AppState, dispatch: Dispatch<Action>) => {
  const { cardStatuses, allCards, earnedBadges } = currentState;

  badgeThresholds.forEach((badge: BadgeType) => {
    if (earnedBadges.includes(badge.id)) {
      return; // Badge already earned
    }

    let achieved = false;
    if (badge.category) {
      // Category-specific badge
      const understoodInCategory = allCards.filter(card => card.category === badge.category)
        .reduce((count, card) => {
          const statusEntry = cardStatuses.find(cs => cs.cardId === card.id);
          if (statusEntry && statusEntry.status === 'understood') {
            return count + 1;
          }
          return count;
        }, 0);
      
      if (understoodInCategory >= badge.threshold) {
        achieved = true;
      }
    } else {
      // General badge (total understood cards)
      const totalUnderstood = cardStatuses.filter(cs => cs.status === 'understood').length;
      if (totalUnderstood >= badge.threshold) {
        achieved = true;
      }
    }

    if (achieved) {
      dispatch({ type: 'AWARD_BADGE', payload: { badgeId: badge.id } });
    }
  });
};


// 2. Create the Reducer
const flashcardReducer = (state: AppState, action: Action): AppState => {
  let newCardStatuses: CardStatus[];
  let newStats;
  let newStateWithPotentiallyNewBadge: AppState;


  switch (action.type) {
    case 'LOAD_CARDS': // Potentially for loading from storage or different sets later
      const loadedCardStatuses = action.payload.map(card => ({ cardId: card.id, status: 'unseen' as const }));
      // After loading, check badges as well, as persisted state might immediately qualify for some.
      const initialLoadedState = {
        ...state,
        allCards: [...action.payload],
        cardStatuses: loadedCardStatuses,
        cardStats: calculateStats(loadedCardStatuses),
        earnedBadges: state.earnedBadges, // Keep earnedBadges from persisted state on initial load
      };
      // Note: checkAndAwardBadges would ideally be called in the Provider after initial loadState,
      // or here if dispatch could be accessed, but reducer shouldn't have side effects like dispatching.
      // For now, badge check on LOAD_CARDS will be handled differently or deferred to provider.
      return initialLoadedState;


    case 'MARK_UNDERSTOOD':
      newCardStatuses = state.cardStatuses.map(cs =>
        cs.cardId === action.payload.cardId ? { ...cs, status: 'understood' as const } : cs
      );
      newStats = calculateStats(newCardStatuses);
      // The badge check will be called from the Provider after this state update.
      return {
        ...state,
        cardStatuses: newCardStatuses,
        cardStats: newStats,
      };

    case 'MARK_REVIEW':
      newCardStatuses = state.cardStatuses.map(cs =>
        cs.cardId === action.payload.cardId ? { ...cs, status: 'review' as const } : cs
      );
      newStats = calculateStats(newCardStatuses);
      return {
        ...state,
        cardStatuses: newCardStatuses,
        cardStats: newStats,
      };

    case 'SET_FILTER':
      return {
        ...state,
        currentFilter: action.payload.filter,
      };

    case 'AWARD_BADGE':
      if (state.earnedBadges.includes(action.payload.badgeId)) {
        return state; // Badge already earned
      }
      // When a badge is awarded, we might need to re-evaluate if this triggers other badges (not common, but possible)
      // However, checkAndAwardBadges is designed to be called after a state change that could trigger a badge.
      // So, just updating earnedBadges here is correct.
      newStateWithPotentiallyNewBadge = {
        ...state,
        earnedBadges: [...state.earnedBadges, action.payload.badgeId],
      };
      // It's better to call checkAndAwardBadges from the Provider after this action is processed.
      return newStateWithPotentiallyNewBadge;
    
    case 'RESET_PROGRESS':
        const resetCardStatuses = state.allCards.map(card => ({ cardId: card.id, status: 'unseen' as const }));
        return {
            ...state,
            cardStatuses: resetCardStatuses,
            earnedBadges: [],
            currentFilter: null,
            cardStats: calculateStats(resetCardStatuses),
        };

    default:
      return state;
  }
};

// 3. Create the Context and Provider
interface FlashcardContextProps {
  state: AppState;
  dispatch: Dispatch<Action>;
}

const FlashcardContext = createContext<FlashcardContextProps | undefined>(undefined);

import toast from 'react-hot-toast'; // Import toast
import { badgeThresholds as allBadgeDefinitions } from '@/data/mockData'; // For easy lookup

// Flag for localStorage availability
let localStorageUnavailable = false;

export const FlashcardProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(flashcardReducer, initialState, loadState);
  const previousEarnedBadgesRef = React.useRef<string[]>(state.earnedBadges);

  // Effect for saving to localStorage (already implemented)
  useEffect(() => {
    if (localStorageUnavailable) return;
    try {
      const persistedState: PersistedState = {
        cardStatuses: state.cardStatuses,
        earnedBadges: state.earnedBadges,
        currentFilter: state.currentFilter,
      };
      localStorage.setItem(GEMFLASH_STATE_KEY, JSON.stringify(persistedState));
    } catch (error) {
      console.error("Failed to save state to localStorage:", error);
      localStorageUnavailable = true;
    }
  }, [state.cardStatuses, state.earnedBadges, state.currentFilter]); // More specific dependencies for localStorage

  // Effect for checking badges when relevant state changes (e.g., card marked understood)
  useEffect(() => {
    // console.log("FlashcardProvider: useEffect triggered for badge check due to cardStatuses change.");
    checkAndAwardBadges(state, dispatch);
  }, [state.cardStatuses, state]); // Check badges when card statuses change

  // Effect for handling toast notifications when badges are earned
  useEffect(() => {
    const currentEarnedBadges = state.earnedBadges;
    const previousEarnedBadges = previousEarnedBadgesRef.current;

    if (currentEarnedBadges.length > previousEarnedBadges.length) {
      const newBadgeIds = currentEarnedBadges.filter(id => !previousEarnedBadges.includes(id));
      newBadgeIds.forEach(badgeId => {
        const badgeInfo = allBadgeDefinitions.find(b => b.id === badgeId);
        if (badgeInfo) {
          console.log(`New badge earned: ${badgeInfo.name}`);
          toast.success(`🎉 Badge Unlocked: ${badgeInfo.icon} ${badgeInfo.name}!`, {
            duration: 4000,
          });
        }
      });
    }
    previousEarnedBadgesRef.current = currentEarnedBadges;
  }, [state.earnedBadges, state]); // Listen specifically to changes in earnedBadges array

  return (
    <FlashcardContext.Provider value={{ state, dispatch }}>
      {children}
    </FlashcardContext.Provider>
  );
};

// Custom hook for consuming context
export const useFlashcards = (): FlashcardContextProps => {
  const context = useContext(FlashcardContext);
  if (context === undefined) {
    throw new Error('useFlashcards must be used within a FlashcardProvider');
  }
  return context;
};

export { initialState, calculateStats }; // Remove flashcardReducer from here as it's internal
export type { FlashcardContextProps }; // Keep type export
