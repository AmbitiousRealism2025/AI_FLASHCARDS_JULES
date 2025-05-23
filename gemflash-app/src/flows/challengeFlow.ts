import { defineFlow, runFlow } from 'genkit';
import { geminiPro } from 'genkit/models'; // Using geminiPro model from genkit/models
import * as z from 'zod';

// Define input schema using Zod
export const ChallengeInputSchema = z.object({
  cardTerm: z.string(),
  cardDefinition: z.string(),
  // userProgress: z.string().optional(), // Example of an optional field
});

// Define output schema using Zod
export const ChallengeOutputSchema = z.object({
  challengeText: z.string(),
});

// Define the Genkit flow
export const generateChallengeFlow = defineFlow(
  {
    name: 'generateChallengeFlow',
    inputSchema: ChallengeInputSchema,
    outputSchema: ChallengeOutputSchema,
  },
  async (input) => {
    const { cardTerm, cardDefinition } = input;

    // Construct the prompt for Gemini
    // R-03: Prompt Engineering: Incorporate placeholders, instructions, and a few-shot example.
    const prompt = `
You are an AI assistant helping a user learn complex AI concepts.
Your task is to generate a short, practical challenge or question based on the provided AI concept.
The challenge should be suitable for a self-learner to test their understanding.
Make the challenge engaging and encourage application of the concept.

Concept Term: ${cardTerm}
Concept Definition: ${cardDefinition}

Few-shot Example:
Concept: Supervised Learning - Learning from labeled data.
Challenge: Describe a real-world scenario where supervised learning could be used to solve a problem in the healthcare domain. Be specific about the data that would be labeled and what the model would predict. Avoid using email spam filtering or image classification of common animals as examples.

Now, generate a challenge for the provided concept.
Challenge:
    `;

    try {
      // Use the Gemini model to generate content
      const llmResponse = await geminiPro.generate({
        prompt: prompt,
        config: {
          temperature: 0.6, // Adjust for creativity vs. predictability
          maxOutputTokens: 150, // Keep challenges concise
        },
      });

      const challengeText = llmResponse.text();

      if (!challengeText || challengeText.trim() === "") {
        // Fallback or error if the response is empty
        console.error("Genkit Challenge Flow: LLM response was empty.");
        return {
          challengeText: `Could not generate a challenge for "${cardTerm}". Please try again. (Empty LLM Response)`,
        };
      }
      
      console.log(`Genkit Challenge Flow: Generated challenge for "${cardTerm}": ${challengeText}`);
      return {
        challengeText: challengeText.trim(),
      };

    } catch (error) {
      console.error("Genkit Challenge Flow: Error generating challenge:", error);
      // Provide a user-friendly error message that can be displayed in the modal
      // Avoid exposing raw error details to the client if they are too technical
      let errorMessage = `An error occurred while generating the challenge for "${cardTerm}".`;
      if (error instanceof Error && error.message.includes('API key not valid')) {
        errorMessage = "Failed to generate challenge: Invalid API key. Please check server configuration.";
      } else if (error instanceof Error && error.message.includes('quota')) {
        errorMessage = "Failed to generate challenge: API quota exceeded. Please try again later.";
      }
      // For other errors, the generic message is fine or log more details server-side.
      
      // Instead of throwing, return an error structure or a challengeText indicating failure
      // This allows the API route to handle it gracefully.
      // For this setup, we'll make challengeText indicate the error.
      return {
        challengeText: errorMessage, // Or a more structured error if preferred
      };
    }
  }
);

// Example of how to run this flow (e.g., for testing, not for client direct call)
// async function testFlow() {
//   const result = await runFlow(generateChallengeFlow, {
//     cardTerm: "Activation Function",
//     cardDefinition: "A function in a neural network that defines the output of a neuron given a set of inputs. It introduces non-linearity into the network."
//   });
//   console.log(result);
// }
// testFlow();
