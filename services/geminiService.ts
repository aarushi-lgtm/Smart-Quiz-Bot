import { GoogleGenAI, Type } from "@google/genai";
import { Question } from '../types';
import { TOTAL_QUESTIONS } from "../constants";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });

export const generateQuizQuestions = async (topic: string): Promise<Question[]> => {
  const prompt = `Generate ${TOTAL_QUESTIONS} multiple-choice questions about ${topic}. Each question should have 4 options, a brief explanation for the correct answer, and a specific topic for the question itself.`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            questions: {
              type: Type.ARRAY,
              description: "A list of quiz questions.",
              items: {
                type: Type.OBJECT,
                properties: {
                  question: {
                    type: Type.STRING,
                    description: "The question text."
                  },
                  options: {
                    type: Type.ARRAY,
                    description: "A list of 4 possible answers.",
                    items: { type: Type.STRING }
                  },
                  correctAnswer: {
                    type: Type.STRING,
                    description: "The correct answer, which must be one of the provided options."
                  },
                  explanation: {
                    type: Type.STRING,
                    description: "A brief explanation of why the answer is correct."
                  },
                  topic: {
                    type: Type.STRING,
                    description: "The specific topic of this question (e.g., 'CSS Flexbox', 'JavaScript Promises')."
                  }
                },
                required: ["question", "options", "correctAnswer", "explanation", "topic"]
              }
            }
          },
          required: ["questions"]
        }
      }
    });

    const jsonText = response.text.trim();
    const parsed = JSON.parse(jsonText);
    
    if (!parsed.questions || !Array.isArray(parsed.questions)) {
        throw new Error("Invalid response format from AI: 'questions' array not found.");
    }
    
    return parsed.questions as Question[];

  } catch (error) {
    console.error("Error generating quiz questions:", error);
    throw new Error("Failed to generate quiz questions. Please try again.");
  }
};


export const generateLearningContent = async (topic: string): Promise<string> => {
    const prompt = `Explain the concept of '${topic}' in detail. Assume you're teaching a beginner. Use simple language, clear headings, bullet points for lists, and provide code examples where applicable. Format the entire response in Markdown.`;

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
        });
        return response.text.trim();
    } catch (error) {
        console.error("Error generating learning content:", error);
        throw new Error(`Failed to generate learning material for ${topic}.`);
    }
}
