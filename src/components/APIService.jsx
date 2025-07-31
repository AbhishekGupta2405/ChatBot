import { useCallback } from 'react';

export const useAPIService = () => {
  
  // Clean up text from API response
  const cleanApiResponse = useCallback((text) => {
    if (!text) return "";

    let cleaned = text
      .replace(/\*\*(.*?)\*\*/g, "$1")
      .replace(/\*(.*?)\*/g, "$1")
      .replace(/`(.*?)`/g, "$1")
      .replace(/\n\s*\n/g, "\n")
      .replace(/^\s*[\*\-]\s+/gm, "")
      .replace(/\s+/g, " ")
      .trim();

    if (cleaned.length > 0) {
      cleaned = cleaned.charAt(0).toUpperCase() + cleaned.slice(1);
    }

    return cleaned;
  }, []);

  // Call Gemini API for general queries
  const callGeminiAPI = useCallback(async (userText) => {
    const promptWithLimit = `${userText} \n\nPlease provide a concise response of about 50 words or less.`;

    const response = await fetch("http://localhost:3000/api/gemini", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ prompt: promptWithLimit }),
    });

    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }

    const data = await response.json();
    let cleanedResponse = cleanApiResponse(data.text);

    // Limit response length
    const words = cleanedResponse.split(" ");
    if (words.length > 60) {
      cleanedResponse = words.slice(0, 50).join(" ") + "...";
    }

    return cleanedResponse;
  }, [cleanApiResponse]);

  return {
    callGeminiAPI,
    cleanApiResponse
  };
};