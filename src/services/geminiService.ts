import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize the Google Generative AI with the API key from environment variables
const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey);

// Function to generate a cover letter based on job description and user profile
export const generateCoverLetter = async (
  jobDescription: string,
  userProfile: {
    name: string;
    email: string;
    phone: string;
    address: string;
    skills: string[];
    experience: string;
  }
) => {
  try {
    // For text-only input, use the gemini-pro model
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    // Construct the prompt with job description and user profile
    const prompt = `
      Generate a professional cover letter for the following job:
      
      Job Description:
      ${jobDescription}
      
      My Information:
      Name: ${userProfile.name}
      Email: ${userProfile.email}
      Phone: ${userProfile.phone}
      Address: ${userProfile.address}
      
      My Skills: ${userProfile.skills.join(', ')}
      
      My Experience:
      ${userProfile.experience}
      
      Please create a cover letter with the following sections:
      1. Introduction (addressing the hiring manager and expressing interest in the position)
      2. Body (highlighting relevant skills and experience that match the job description)
      3. Conclusion (expressing enthusiasm for the opportunity and requesting an interview)
      
      Format the response as a JSON object with the following structure:
      {
        "recipientName": "Hiring Manager", // Default if not specified in job description
        "recipientCompany": "", // Extract from job description if possible
        "position": "", // Extract from job description
        "introduction": "",
        "body": "",
        "conclusion": "",
      }
    `;

    // Generate content
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    // Parse the JSON response
    try {
      // Find JSON content within the response (in case there's additional text)
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
      
      // If no JSON pattern found, try parsing the whole text
      return JSON.parse(text);
    } catch (parseError) {
      console.error('Error parsing Gemini response:', parseError);
      throw new Error('Failed to parse the generated cover letter. Please try again.');
    }
  } catch (error) {
    console.error('Error generating cover letter with Gemini:', error);
    throw error;
  }
}; 