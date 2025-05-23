// src/components/CardDeck.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence, PanInfo } from 'framer-motion';
import { flashcards as allFlashcardsData, Flashcard as FlashcardType } from '@/data/mockData';
import Flashcard from './Flashcard';
import ChallengeModal from './ChallengeModal'; // Import ChallengeModal
import { useFlashcards } from '@/contexts/FlashcardContext';
import toast from 'react-hot-toast'; // For lockout message

const swipeThreshold = 100;
const animationDuration = 0.3;
const CHALLENGE_LOCKOUT_SECONDS = 60;

const cardVariants = {
  enter: { opacity: 0, y: 50, scale: 0.9 },
  center: { zIndex: 1, opacity: 1, y: 0, scale: 1, transition: { duration: animationDuration, ease: "easeOut" } },
  exit: (direction: 'left' | 'right') => ({
    zIndex: 0,
    x: direction === 'left' ? -500 : 500,
    opacity: 0,
    scale: 0.8,
    transition: { duration: animationDuration, ease: "easeIn" }
  }),
};

interface LastChallengeTimestamp {
  [cardId: string]: number;
}

const CardDeck: React.FC = () => {
  const { state, dispatch } = useFlashcards();
  const [currentIndexInSession, setCurrentIndexInSession] = useState(0);
  const [sessionDeck, setSessionDeck] = useState<FlashcardType[]>([]);
  const [swipeDirection, setSwipeDirection] = useState<'left' | 'right' | null>(null);

  // State for Challenge Modal
  const [isChallengeModalOpen, setIsChallengeModalOpen] = useState(false);
  const [currentChallengeText, setCurrentChallengeText] = useState('');
  const [isChallengeLoading, setIsChallengeLoading] = useState(false);
  const [challengeError, setChallengeError] = useState<string | null>(null);
  const [lastChallengeTimestamp, setLastChallengeTimestamp] = useState<LastChallengeTimestamp>({});

  useEffect(() => {
    const { allCards, cardStatuses, currentFilter } = state;

    let filteredCards = allCards;

    // Apply category filter if one is active
    if (currentFilter) {
      filteredCards = allCards.filter(card => card.category === currentFilter);
    }

    // From the (potentially filtered) cards, select those for review
    const cardsToReview = filteredCards.filter(card => {
      const statusEntry = cardStatuses.find(cs => cs.cardId === card.id);
      return !statusEntry || statusEntry.status === 'unseen' || statusEntry.status === 'review';
    });
    
    // console.log(`Filter: ${currentFilter || 'All'}, Total in category: ${filteredCards.length}, Cards to review: ${cardsToReview.length}`);

    setSessionDeck(cardsToReview); // If cardsToReview is empty, sessionDeck will be empty.
    setCurrentIndexInSession(0); // Reset index whenever the filter or statuses change
  }, [state.cardStatuses, state.allCards, state.currentFilter, state]); // state is included to catch broader context changes if necessary


  const handleSwipeOrButton = (action: 'review' | 'understood', swipeType?: 'swipe' | 'button') => {
    const currentCard = sessionDeck[currentIndexInSession];
    if (!currentCard) return;
    const via = swipeType === 'swipe' ? 'via swipe' : 'via button';
    if (action === 'review') {
      dispatch({ type: 'MARK_REVIEW', payload: { cardId: currentCard.id } });
      setSwipeDirection('left');
      if (navigator.vibrate) navigator.vibrate(12);
    } else {
      dispatch({ type: 'MARK_UNDERSTOOD', payload: { cardId: currentCard.id } });
      setSwipeDirection('right');
    }
  };

  const advanceCard = () => {
    setSwipeDirection(null);
    if (currentIndexInSession < sessionDeck.length - 1) {
      setCurrentIndexInSession(currentIndexInSession + 1);
    } else {
      console.log('No more cards in current session deck!');
    }
  };

  const onDragEnd = (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const { offset, velocity } = info;
    const swipePower = Math.abs(offset.x) * velocity.x;
    if (swipePower < -swipeThreshold * 100) handleSwipeOrButton('review', 'swipe');
    else if (swipePower > swipeThreshold * 100) handleSwipeOrButton('understood', 'swipe');
  };

  const handleGenerateChallenge = () => {
    const currentCard = sessionDeck[currentIndexInSession];
    if (!currentCard) return;

    const now = Date.now();
    const lastCalled = lastChallengeTimestamp[currentCard.id] || 0;
    const timeSinceLastCall = (now - lastCalled) / 1000; // in seconds

    if (timeSinceLastCall < CHALLENGE_LOCKOUT_SECONDS) {
      const timeLeft = Math.ceil(CHALLENGE_LOCKOUT_SECONDS - timeSinceLastCall);
      toast.error(`Please wait ${timeLeft}s before generating another challenge for this card.`);
      return;
    }

    setIsChallengeLoading(true);
    setCurrentChallengeText('');
    setChallengeError(null);
    setIsChallengeModalOpen(true);
    setLastChallengeTimestamp(prev => ({ ...prev, [currentCard.id]: now }));

    // Actual API Call
    fetch('/api/generateChallenge', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        cardTerm: currentCard.term,
        cardDefinition: currentCard.definition,
      }),
    })
    .then(async (res) => {
      const currentCardForFallback = sessionDeck[currentIndexInSession]; // Access here for use in this .then block

      if (!res.ok) {
        // Handle 429 (Too Many Requests) specifically - no fallback for this
        if (res.status === 429) {
          const errorData = await res.json().catch(() => ({ error: 'Rate limit error response unparseable' }));
          // Let this throw an error to be caught by the .catch block, which won't use static fallback for 429.
          // Or, more directly, set error and return null to prevent further .then processing.
          setChallengeError(errorData.error || `Too many requests. Please try again later.`);
          setCurrentChallengeText('');
          return null; // Signal that we've handled it / error state is set.
        }

        // For other non-ok responses, try to use static fallback
        if (currentCardForFallback && currentCardForFallback.staticChallenge) {
          setCurrentChallengeText(currentCardForFallback.staticChallenge);
          setChallengeError("The AI is a bit busy... Here's a standard challenge for this card:");
          return null; // Signal that we've handled it with a fallback
        }
        // If no static fallback, parse error and throw to be caught by .catch
        const errorData = await res.json().catch(() => ({ error: 'Failed to parse error response' }));
        throw new Error(errorData.error || `HTTP error! status: ${res.status}`);
      }
      return res.json(); // This will be the data for the next .then()
    })
    .then((data) => {
      if (data === null) return; // Fallback was handled in the previous .then block

      // Check if the successful response's challengeText actually indicates an error from the flow/LLM
      // These are cases where the API call itself was "ok" (e.g. 200), but the LLM failed.
      if (data.challengeText && 
          (data.challengeText.startsWith("Failed to generate challenge:") || 
           data.challengeText.startsWith("Could not generate a challenge for") ||
           data.challengeText.startsWith("An error occurred while generating the challenge"))) {
        
        const currentCardForFallback = sessionDeck[currentIndexInSession]; // Access card for fallback
        if (currentCardForFallback && currentCardForFallback.staticChallenge) {
          setCurrentChallengeText(currentCardForFallback.staticChallenge);
          setChallengeError("The AI couldn't generate a new challenge... Here's a standard one for this card:");
        } else {
          setChallengeError(data.challengeText); // Show the error from LLM/flow because no static fallback
          setCurrentChallengeText('');
        }
      } else {
        setCurrentChallengeText(data.challengeText);
        setChallengeError(null);
      }
    })
    .catch((error) => {
      // This .catch block will handle:
      // 1. Network errors (fetch itself fails)
      // 2. Errors thrown from the first .then (e.g., non-429 HTTP errors without static fallback)
      // 3. 429 errors if we decide to throw them from the first .then to be handled here without static fallback
      console.error("Failed to generate challenge (in .catch):", error.message);

      // Check if it's a 429 type error message (if we made it throw and land here)
      // The current logic sets state directly for 429 in the first .then, so this might not be strictly needed here
      // unless that logic changes to re-throw.
      if (error.message.toLowerCase().includes("too many requests")) {
          setChallengeError(error.message);
          setCurrentChallengeText('');
          return; // No static fallback for 429
      }

      const currentCardForFallback = sessionDeck[currentIndexInSession];
      if (currentCardForFallback && currentCardForFallback.staticChallenge) {
        setCurrentChallengeText(currentCardForFallback.staticChallenge);
        setChallengeError("Couldn't connect to the AI for a live challenge. Here's a standard one:");
      } else {
        setChallengeError(error.message || "An unexpected error occurred while fetching the challenge.");
        setCurrentChallengeText('');
      }
    })
    .finally(() => {
      setIsChallengeLoading(false);
    });
  };

  const currentCardToDisplay = sessionDeck[currentIndexInSession];

  // Handle cases where the sessionDeck is empty (either initially or after filtering)
  if (sessionDeck.length === 0) {
    return (
      <div className="text-center flex flex-col items-center justify-center h-96 w-80 p-6 border border-gray-300 rounded-lg shadow-lg bg-white">
        {state.currentFilter ? (
          <p className="text-xl text-gray-700 leading-relaxed">
            No cards to review in the <br />
            <span className="font-semibold">"{state.currentFilter}"</span> category.
            <br /><br />
            All caught up here! 🎉
          </p>
        ) : (
          <p className="text-xl text-gray-700 leading-relaxed">
            No cards available for review.
            <br /><br />
            You've mastered them all for now! 🏆
          </p>
        )}
         <button
          onClick={() => dispatch({ type: 'RESET_PROGRESS' })}
          className="mt-8 px-6 py-3 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75"
        >
          Review All Cards (Reset Progress)
        </button>
      </div>
    );
  }

  // Handle end of the current (potentially filtered) session deck
  if (!currentCardToDisplay && currentIndexInSession >= sessionDeck.length && sessionDeck.length > 0) {
     return (
      <div className="text-center flex flex-col items-center justify-center h-96 w-80 p-6 border border-gray-300 rounded-lg shadow-lg bg-white">
        <p className="text-2xl mb-6 text-gray-700 leading-relaxed">
           🎉 Nicely done! 🎉
           <br/><br/>
           You've completed all cards in {state.currentFilter ? `the "${state.currentFilter}" category` : "this session"}.
        </p>
        <button
          onClick={() => {
            // This will re-trigger the useEffect that builds the sessionDeck.
            // If all cards in the filter are 'understood', it will show the "No cards to review" message.
            // If some were marked 'review', they will reappear.
            setCurrentIndexInSession(0); 
          }}
          className="mt-4 px-6 py-3 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75"
        >
          Review This Session Again
        </button>
         <button
          onClick={() => dispatch({ type: 'SET_FILTER', payload: { filter: null } })}
          className="mt-4 px-6 py-3 bg-gray-500 text-white font-semibold rounded-lg shadow-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-opacity-75"
        >
          View All Categories
        </button>
      </div>
    );
  }

  return (
    <>
      <div className="flex flex-col items-center relative w-full" style={{ minHeight: '550px' }}>
        <div className="relative w-80 h-96 flex items-center justify-center">
          <AnimatePresence initial={false} custom={swipeDirection} onExitComplete={advanceCard}>
            {currentCardToDisplay && (
              <Flashcard
                key={currentCardToDisplay.id + '-' + currentIndexInSession}
                card={currentCardToDisplay}
                custom={swipeDirection}
                variants={cardVariants}
                initial="enter"
                animate="center"
                exit="exit"
                drag="x"
                dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
                dragElasticity={0.7}
                onDragEnd={onDragEnd}
                onGenerateChallenge={handleGenerateChallenge} // Pass the handler
              />
            )}
          </AnimatePresence>
        </div>

        {currentCardToDisplay && (
          <div className="mt-8 flex space-x-4 z-10">
            <button
              onClick={() => handleSwipeOrButton('review', 'button')}
              disabled={swipeDirection !== null}
              className="px-6 py-3 bg-red-500 text-white font-semibold rounded-lg shadow-md hover:bg-red-600 disabled:opacity-50"
            >
              Review Later
            </button>
            <button
              onClick={() => handleSwipeOrButton('understood', 'button')}
              disabled={swipeDirection !== null}
              className="px-6 py-3 bg-green-500 text-white font-semibold rounded-lg shadow-md hover:bg-green-600 disabled:opacity-50"
            >
              Understood
            </button>
          </div>
        )}
      </div>
      <ChallengeModal
        isOpen={isChallengeModalOpen}
        onClose={() => setIsChallengeModalOpen(false)}
        challengeText={currentChallengeText}
        isLoading={isChallengeLoading}
        errorText={challengeError}
      />
    </>
  );
};

export default CardDeck;
