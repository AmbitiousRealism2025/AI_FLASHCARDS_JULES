// src/app/page.tsx
import CardDeck from '@/components/CardDeck';
import CategoryFilter from '@/components/CategoryFilter'; // Import the CategoryFilter

export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col items-center p-8 bg-gray-100"> {/* Adjusted justify-center to allow content flow from top */}
      <header className="my-10 text-center"> {/* Added text-center for header content */}
        <h1 className="text-4xl font-bold text-gray-800">GemFlash</h1>
        <p className="text-lg text-gray-600">AI-Powered Flashcards</p>
      </header>
      <CategoryFilter /> {/* Add the CategoryFilter component */}
      <div className="mt-6 w-full flex justify-center"> {/* Ensure CardDeck is also centered if it doesn't fill width */}
        <CardDeck />
      </div>
    </main>
  );
}
