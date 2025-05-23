// src/components/ChallengeModal.tsx
'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface ChallengeModalProps {
  isOpen: boolean;
  onClose: () => void;
  challengeText: string;
  isLoading: boolean;
  errorText?: string | null;
}

const ChallengeModal: React.FC<ChallengeModalProps> = ({
  isOpen,
  onClose,
  challengeText,
  isLoading,
  errorText,
}) => {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          onClick={onClose} // Close on overlay click
        >
          <motion.div
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 20, opacity: 0 }}
            className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md text-gray-800"
            onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside modal
          >
            <h2 className="text-2xl font-bold mb-4 text-center">AI Challenge</h2>

            {isLoading && (
              <div className="flex flex-col items-center justify-center my-8">
                <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent border-solid rounded-full animate-spin"></div>
                <p className="mt-3 text-lg">Generating your challenge...</p>
              </div>
            )}

            {errorText && !isLoading && (
              <div className="my-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-md">
                <p className="font-semibold">Error:</p>
                <p>{errorText}</p>
              </div>
            )}

            {!isLoading && !errorText && challengeText && (
              <div className="my-6 p-4 bg-gray-50 rounded-md min-h-[100px]">
                <p className="text-lg whitespace-pre-wrap">{challengeText}</p>
              </div>
            )}
            
            {!isLoading && !errorText && !challengeText && (
                 <div className="my-6 p-4 bg-gray-50 rounded-md min-h-[100px]">
                    <p className="text-lg text-gray-500">No challenge generated yet.</p>
                 </div>
            )}


            <div className="mt-6 flex justify-end">
              <button
                onClick={onClose}
                className="px-5 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500"
              >
                Close
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ChallengeModal;
