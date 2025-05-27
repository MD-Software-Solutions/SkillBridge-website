import { apiBaseUrl } from "../../config/config";

export const getAISuggestedBio = async (input) => {
  try {
    const response = await fetch(`${apiBaseUrl}/generate-bio`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json', // Ensure this header is set
      },
      body: JSON.stringify({ userInput: input }), // Ensure payload is JSON
    });

    if (!response.ok) {
      throw new Error('Failed to generate bio');
    }

    const data = await response.json();
    return data.bio;
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
};