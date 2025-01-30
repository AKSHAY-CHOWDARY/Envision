import { GoogleGenerativeAI } from '@google/generative-ai';

// Get API key from environment variables
const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

// Check if API key is available
if (!apiKey) {
  console.error('Gemini API key is not set in environment variables');
}

const genAI = new GoogleGenerativeAI(apiKey);

export async function analyzeAnswer(question, answer) {
  try {
    if (!apiKey) {
      throw new Error('Gemini API key is not configured');
    }

    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    
    const prompt = `
      Analyze this interview answer for the question: "${question}"
      
      Answer: "${answer}"
      
      Provide a brief analysis including:
      1. Relevance (0-10)
      2. Clarity (0-10)
      3. Confidence (0-10)
      4. Key strengths
      5. Areas for improvement
      
      Format the response as JSON with these exact keys:
      {
        "relevance": number,
        "clarity": number,
        "confidence": number,
        "strengths": string[],
        "improvements": string[]
      }
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    // Ensure we get valid JSON
    try {
      return JSON.parse(text);
    } catch (e) {
      console.error('Failed to parse Gemini response:', text);
      return {
        relevance: 5,
        clarity: 5,
        confidence: 5,
        strengths: ['Unable to analyze response'],
        improvements: ['Please try again']
      };
    }
  } catch (error) {
    console.error('Error analyzing answer:', error);
    return {
      relevance: 5,
      clarity: 5,
      confidence: 5,
      strengths: ['Error analyzing response'],
      improvements: ['Please check API key configuration']
    };
  }
}

export async function generateOverallFeedback(answers) {
  try {
    if (!apiKey) {
      throw new Error('Gemini API key is not configured');
    }

    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    
    const prompt = `
      Review these interview answers and provide overall feedback:
      ${answers.map(a => `Q: ${a.question}\nA: ${a.answer}`).join('\n\n')}
      
      Provide:
      1. Overall score (0-100)
      2. General strengths
      3. Areas for improvement
      4. Specific recommendations
      
      Format the response as JSON with these exact keys:
      {
        "score": number,
        "strengths": string[],
        "improvements": string[],
        "recommendations": string[]
      }
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    // Ensure we get valid JSON
    try {
      return JSON.parse(text);
    } catch (e) {
      console.error('Failed to parse Gemini response:', text);
      return {
        score: 70,
        strengths: ['Unable to analyze responses'],
        improvements: ['Please try again'],
        recommendations: ['Check system configuration']
      };
    }
  } catch (error) {
    console.error('Error generating feedback:', error);
    return {
      score: 70,
      strengths: ['Error analyzing responses'],
      improvements: ['Please check API key configuration'],
      recommendations: ['Verify API key is set correctly']
    };
  }
}