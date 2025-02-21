import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize Gemini client
const createGeminiClient = () => {
  const apiKey = process.env.EXPO_PUBLIC_GEMINI_API_KEY || '';
  return new GoogleGenerativeAI(apiKey);
};

function extractJsonFromText(text: string): any {
  try {
    // Try to find content between curly braces
    const match = text.match(/\{[\s\S]*\}/);
    if (match) {
      // Try to parse the matched content
      return JSON.parse(match[0]);
    }

    // If no JSON structure found, extract information using basic parsing
    const tasks: any[] = [];
    const events: any[] = [];
    const keyPoints: string[] = [];
    let summary = '';

    // Split text into lines
    const lines = text.split('\n');
    
    lines.forEach(line => {
      line = line.trim();
      
      // Extract tasks
      if (line.toLowerCase().includes('task') || line.includes('- ')) {
        tasks.push({
          title: line.replace(/^-|\btask:|task\b/i, '').trim(),
          deadline: 'unspecified',
          priority: 'medium'
        });
      }
      
      // Extract events
      if (line.toLowerCase().includes('meeting') || 
          line.match(/\d{1,2}:\d{2}/) || 
          line.match(/\b(am|pm)\b/i)) {
        events.push({
          title: line,
          date: 'unspecified',
          time: line.match(/\d{1,2}:\d{2}(?:\s*(?:am|pm))?/i)?.[0] || 'unspecified',
          location: 'unspecified'
        });
      }
      
      // Extract key points
      if (line.toLowerCase().includes('point') || 
          line.toLowerCase().includes('discuss')) {
        keyPoints.push(line);
      }
    });

    // Use the first non-empty line as summary if no key points found
    summary = keyPoints.length > 0 ? 
      keyPoints[0] : 
      lines.find(line => line.trim().length > 0) || text;

    return {
      tasks,
      events,
      keyPoints,
      summary
    };
  } catch (error) {
    console.error('Error extracting JSON:', error);
    return {
      tasks: [],
      events: [],
      keyPoints: [],
      summary: text
    };
  }
}

export async function analyzeTranscript(text: string) {
  const genAI = createGeminiClient();
  const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

  const prompt = `Analyze the following transcript and extract:
  1. Action items and tasks with deadlines
  2. Meeting details (dates, times, locations)
  3. Key discussion points
  4. Calendar events

  Please format each item clearly with bullet points or numbers.
  If there are dates or times mentioned, include them with the relevant items.

  Transcript: "${text}"`;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const responseText = response.text();
    
    // Extract structured data from the response text
    const analyzedData = extractJsonFromText(responseText);
    console.log('Analyzed Data:', analyzedData); // For debugging
    return analyzedData;
  } catch (error) {
    console.error('Error analyzing transcript:', error);
    return {
      tasks: [],
      events: [],
      keyPoints: [],
      summary: text
    };
  }
}