import { googleAI } from '@genkit-ai/googleai';
import { configureGenkit } from 'genkit';
import { geminiPro } from '@genkit-ai/googleai'; // Ensure you have a model imported if needed directly

export default configureGenkit({
  plugins: [
    googleAI({
      // The API key will be read from the GOOGLE_API_KEY environment variable.
      // Ensure GOOGLE_API_KEY is set in your .env.local file.
      // apiKey: process.env.GOOGLE_API_KEY // This line is often not needed if GOOGLE_API_KEY is standard
    }),
  ],
  logLevel: 'debug',
  enableTracingAndMetrics: true,
  // Define available models if you want to reference them by a specific name in your flows
  // models: {
  //   'gemini-pro': geminiPro, // Example if you want to use an alias
  // },
});
