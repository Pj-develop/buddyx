// File: index.ts
import { serve } from "https://deno.land/std@0.140.0/http/server.ts";

/**
 * Uses the Deepgram API to transcribe an audio file given its public URL.
 * @param audioUrl The public URL of the audio file uploaded to Supabase Storage.
 * @returns A promise resolving to the transcription text.
 */
async function createTranscription(audioUrl: string): Promise<string> {
  // 1. Download the audio file from the provided URL.
  const audioResponse = await fetch(audioUrl);
  if (!audioResponse.ok) {
    throw new Error("Failed to fetch audio file");
  }
  const audioBlob = await audioResponse.blob();

  // 2. Retrieve your Deepgram API key from environment variables.
  const deepgramApiKey = Deno.env.get("DEEPGRAM_API_KEY");
  if (!deepgramApiKey) {
    throw new Error("Deepgram API key not set");
  }

  // 3. Call the Deepgram transcription endpoint.
  // Deepgram expects the raw binary audio in the body.
  const transcriptionResponse = await fetch("https://api.deepgram.com/v1/listen", {
    method: "POST",
    headers: {
      "Authorization": `Token ${deepgramApiKey}`,
      "Content-Type": "audio/m4a", // Adjust if your audio format is different.
    },
    body: audioBlob,
  });

  if (!transcriptionResponse.ok) {
    const errorData = await transcriptionResponse.json();
    throw new Error(`Deepgram API error: ${JSON.stringify(errorData)}`);
  }

  // 4. Parse Deepgram's response to extract the transcription.
  const data = await transcriptionResponse.json();
  const transcript = data.results?.channels?.[0]?.alternatives?.[0]?.transcript;
  if (!transcript) {
    throw new Error("Failed to extract transcription");
  }
  return transcript;
}

// Main edge function handler.
serve(async (req) => {
  // Only allow POST requests.
  if (req.method !== "POST") {
    return new Response(
      JSON.stringify({ error: "Method Not Allowed" }),
      {
        status: 405,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
  
  try {
    // Expecting a JSON payload with { "audioUrl": "https://your-supabase-url/..." }
    const { audioUrl } = await req.json();
    if (!audioUrl) {
      return new Response(
        JSON.stringify({ error: "audioUrl is required" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }
    
    // Get the transcription from Deepgram.
    const transcriptionText = await createTranscription(audioUrl);
    
    return new Response(
      JSON.stringify({ transcription: transcriptionText }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : String(error) }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
});