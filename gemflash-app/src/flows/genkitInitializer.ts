// src/flows/genkitInitializer.ts
import { genkitLoaded } from 'genkit';
import genkitConfig from '../../genkit.conf.js'; // Adjust path if your genkit.conf.js is elsewhere

let isGenkitInitialized = false;

export async function initGenkit() {
  if (!isGenkitInitialized) {
    // console.log("Initializing Genkit...");
    await genkitLoaded(); // This loads plugins from the config
    isGenkitInitialized = true;
    // console.log("Genkit initialized successfully.");
  } else {
    // console.log("Genkit already initialized.");
  }
}
