// src/app/api/generateChallenge/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { runFlow } from 'genkit';
import { generateChallengeFlow, ChallengeInputSchema } from '@/flows/challengeFlow'; // Adjust path as needed
import { initGenkit } from '@/flows/genkitInitializer'; // Ensure Genkit is initialized

export async function POST(request: NextRequest) {
  await initGenkit(); // Ensure Genkit is initialized before running flows

  try {
    const body = await request.json();
    
    // Validate input using Zod schema from the flow
    const validationResult = ChallengeInputSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        { error: 'Invalid input', details: validationResult.error.flatten() },
        { status: 400 }
      );
    }

    const { cardTerm, cardDefinition } = validationResult.data;

    // console.log(`API Route: Received request for term "${cardTerm}"`);

    const challengeOutput = await runFlow(generateChallengeFlow, {
      cardTerm,
      cardDefinition,
    });

    // console.log("API Route: Flow output:", challengeOutput);
    
    // Check if challengeText indicates an error from the flow
    if (challengeOutput.challengeText.startsWith("Failed to generate challenge:") || 
        challengeOutput.challengeText.startsWith("Could not generate a challenge for") ||
        challengeOutput.challengeText.startsWith("An error occurred while generating the challenge")) {
      // This means the flow itself handled an error and returned a user-friendly message.
      // We might want to return a different status code, e.g., 500 or 503, if it's a server-side issue.
      // For API key issues or quota issues, 500 is appropriate.
      // For "Could not generate", perhaps 200 with the message is fine, or 503.
      // Let's assume for now that a 200 with the error message in challengeText is acceptable for client handling.
      // OR, more correctly, if it's a server-side error, return a 500.
      if (challengeOutput.challengeText.includes("API key") || challengeOutput.challengeText.includes("quota")) {
        return NextResponse.json({ error: challengeOutput.challengeText }, { status: 500 });
      }
      // If it's a "could not generate" type of message, it's not strictly a server error, but a failure of the LLM.
      // We can return it as part of a successful response, letting the client display it.
    }


    return NextResponse.json(challengeOutput, { status: 200 });

  } catch (error: any) {
    console.error('API Route: Error running generateChallengeFlow:', error);
    let errorMessage = 'An unexpected error occurred.';
    let errorStatus = 500;

    if (error.message && error.message.includes('Flow not found')) {
        errorMessage = 'Challenge generation service is not available (flow not found).';
        errorStatus = 404;
    } else if (error.message && (error.message.includes('API key not valid') || error.message.includes('GOOGLE_API_KEY'))) {
        errorMessage = 'Challenge generation service is misconfigured (API key issue).';
        errorStatus = 500; // Internal server error
    }
    
    return NextResponse.json(
      { error: errorMessage, details: error.message || String(error) },
      { status: errorStatus }
    );
  }
}
