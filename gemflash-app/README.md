# GemFlash 💎

## Objective (Purpose & "Why")

GemFlash is a mobile-first, swipe-driven web app designed to help self-learners internalize core AI concepts in short sessions and immediately apply them through LLM-generated challenges. The MVP targets single-device use, zero back-end ops (beyond Genkit AI calls), and aims for a < 5-minute onboarding experience.

This project was developed by Jules, an AI software engineering agent.

## Tech Stack

*   **Frontend:** Next.js 14 (App Router, React Server Components), TypeScript
*   **State Management:** React Context + `useReducer`
*   **Gestures & Animations:** Framer Motion
*   **Styling:** Tailwind CSS
*   **Notifications:** React Hot Toast
*   **Persistence:** Browser `localStorage`
*   **AI Backend:** Genkit + Google Gemini
*   **Linting/Formatting:** ESLint, Prettier

## Features Implemented (MVP Progress)

The following core features have been implemented as part of the Minimum Viable Product development:

1.  **Project Setup & Scaffolding:**
    *   Next.js 14 project with TypeScript.
    *   Organized directory structure (components, contexts, services, data, flows).
    *   ESLint and Prettier configured for code quality.

2.  **Flashcard Core Functionality:**
    *   `mockData.ts` for pre-seeded AI flashcards (20+ cards) and badge criteria.
    *   Dynamic display of flashcards, showing term first, then definition/example on interaction.
    *   Swipe gestures (right for "understood", left for "review") using Framer Motion.
    *   Button-based alternatives for swipe actions (accessibility).
    *   Animations for card transitions (enter, exit).
    *   Haptic feedback on "review" swipe.

3.  **State Management & Persistence:**
    *   Global application state managed via React Context and `useReducer`.
    *   User progress (card statuses: 'understood', 'review', 'unseen'), earned badges, and filter preferences persisted to `localStorage`.
    *   State rehydrated on page load.

4.  **Badge Engine:**
    *   Badges awarded automatically based on thresholds (e.g., number of understood cards in a category).
    *   Toast notifications (via `react-hot-toast`) for newly unlocked badges.
    *   Earned badges are persisted.

5.  **AI Challenge Generation (Genkit + Gemini):**
    *   "Generate Challenge" button on flashcards.
    *   Integration with Genkit and Google Gemini (e.g., `gemini-pro`) to generate contextual challenges.
    *   Challenges displayed in a modal, with loading and error states.
    *   60-second lockout per card to prevent duplicate API calls.
    *   Static fallback challenges from `mockData.ts` if live AI generation fails.
    *   Prompt engineering techniques (few-shot examples) to guide AI output.
    *   API key for Gemini (`GOOGLE_API_KEY`) managed via `.env.local`.

6.  **Filtering Functionality:**
    *   Category filter chips to allow users to focus on specific topics.
    *   "All" option to view all pending cards.
    *   Filter state persists across sessions.
    *   Card deck updates dynamically based on the active filter.

## Setup Instructions

1.  **Clone the repository:**
    ```bash
    git clone <repository-url>
    cd gemflash-app
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    # or
    yarn install
    ```

3.  **Set up Environment Variables:**
    *   Create a file named `.env.local` in the `gemflash-app` root directory.
    *   Add your Google Gemini API key to this file:
        ```
        GOOGLE_API_KEY="YOUR_GEMINI_API_KEY_HERE"
        ```
    *   Replace `"YOUR_GEMINI_API_KEY_HERE"` with your actual API key. Without this, the AI Challenge Generation feature will use static fallbacks or show errors.

4.  **Run the development server:**
    ```bash
    npm run dev
    # or
    yarn dev
    ```
    Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Remaining MVP Steps

The following major areas are planned to complete the MVP:

1.  **UI/UX & Styling:**
    *   Detailed implementation of UI based on Figma designs (Mobile 375x812, Tablet 768x1024).
    *   Application of specified motion specs (spring duration, ease-out-quad).
    *   Ensuring all interactive controls have ARIA labels and meet WCAG 2.1 AA for the critical path.

2.  **Non-Functional Requirements & Testing:**
    *   **Performance:** Aim for FMP ≤ 2s, TTI ≤ 3s (Moto G 4G); Lighthouse mobile score ≥ 85.
    *   **Accessibility:** CI checks with `axe-linter`.
    *   **Offline Functionality:** Test flashcard review functionality after the first load without network.
    *   **Usability:** Conduct 5-user guerrilla testing for discoverability and error handling.
    *   **Security:** Repo secret scan; ensure no PII stored.
    *   **Crash Reporting:** Basic monitoring for crash-free sessions (target ≥ 99.5%).

3.  **Deployment & Release Prep:**
    *   Deploy to Vercel Hobby (or similar).
    *   Set up CI/CD pipeline with Lighthouse & accessibility gates.
    *   Prepare classroom demo script & fallback static dataset.
    *   Finalize coding guidelines and any other necessary documentation.

## Coding Guidelines

*   **TypeScript:** The project is written in TypeScript for type safety and better developer experience.
*   **ESLint:** We use ESLint for code linting to maintain code quality and consistency. Configuration is in `.eslintrc.json`.
*   **Prettier:** Prettier is used for code formatting. Configuration is in `.prettierrc.json`. Please ensure your code is formatted before committing.
