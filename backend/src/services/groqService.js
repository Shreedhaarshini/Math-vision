const axios = require("axios");
const fs = require("fs");
const path = require("path");

// Expert Math Tutor System Prompt
const EXPERT_MATH_TUTOR_PROMPT = `You are an expert, highly encouraging math tutor. Your goal is to help students understand the "why" and "how" of math, not just give the answer. When given a math problem (via text or image), you must structure your response EXACTLY like this:

**1. Concept Overview:** Briefly explain the core math concept needed to solve this (e.g., "To find the volume of a cylinder, we need...").

**2. Given Information:** List out the variables we already know.

**3. Step-by-Step Solution:** Break the math down into small, logical steps. Explain what you are doing before you write the equation. Use standard LaTeX formatting for ALL math. Use \\( ... \\) for inline math and \\[ ... \\] for standalone block equations.

**4. Final Answer:** Clearly state the final answer in bold.

Rules:
- Always be encouraging and supportive
- Explain concepts clearly before showing calculations
- Use LaTeX for ALL mathematical expressions
- Return the response in markdown format`;

// Solve with text input
const solveWithGroq = async (question) => {
  try {
    if (!process.env.GROQ_API_KEY) {
      throw new Error("GROQ API KEY MISSING");
    }

    const response = await axios.post(
      'https://api.groq.com/openai/v1/chat/completions',
      {
        model: "llama-3.1-8b-instant",
        messages: [
          {
            role: "system",
            content: EXPERT_MATH_TUTOR_PROMPT
          },
          {
            role: "user",
            content: question
          }
        ],
        temperature: 0.3
      },
      {
        headers: {
          "Authorization": `Bearer ${process.env.GROQ_API_KEY}`,
          "Content-Type": "application/json"
        }
      }
    );

    let content = response.data.choices[0].message.content;

    // Parse the response to extract structured data
    return parseMathResponse(content);
    
  } catch (error) {
    console.error("FULL GROQ ERROR:", error.response?.data || error.message);
    throw new Error("GROQ API failed");
  }
};

// Solve with image (Vision API)
const solveWithGroqVision = async (imagePath) => {
  try {
    if (!process.env.GROQ_API_KEY) {
      throw new Error("GROQ API KEY MISSING");
    }

    // Read image and convert to base64
    const imageBuffer = fs.readFileSync(imagePath);
    const base64Image = imageBuffer.toString('base64');
    const mimeType = 'image/jpeg'; // Adjust based on actual file type

    const response = await axios.post(
      'https://api.groq.com/openai/v1/chat/completions',
      {
        model: "meta-llama/llama-4-scout-17b-16e-instruct", // Vision-capable model
        messages: [
          {
            role: "system",
            content: EXPERT_MATH_TUTOR_PROMPT
          },
          {
            role: "user",
            content: [
              {
                type: "text",
                text: "Please solve this math problem step by step."
              },
              {
                type: "image_url",
                image_url: {
                  url: `data:${mimeType};base64,${base64Image}`
                }
              }
            ]
          }
        ],
        temperature: 0.3,
        max_tokens: 2048
      },
      {
        headers: {
          "Authorization": `Bearer ${process.env.GROQ_API_KEY}`,
          "Content-Type": "application/json"
        }
      }
    );

    let content = response.data.choices[0].message.content;
    return parseMathResponse(content);
    
  } catch (error) {
    console.error("VISION API ERROR:", error.response?.data || error.message);
    throw new Error("Vision API failed");
  }
};

// Parse the AI response into structured format
const parseMathResponse = (content) => {
  try {
    // Try to extract JSON if present
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[0]);
      return {
        steps: parsed.steps || extractStepsFromMarkdown(content),
        final_answer: parsed.final_answer || extractFinalAnswer(content),
        topic: parsed.topic || "Math",
        full_response: content
      };
    }
    
    // Parse markdown format
    return {
      steps: extractStepsFromMarkdown(content),
      final_answer: extractFinalAnswer(content),
      topic: "Math",
      full_response: content
    };
  } catch (e) {
    // Fallback parsing
    const lines = content.split('\n').filter(line => line.trim());
    const steps = [];
    let finalAnswer = "";
    
    for (const line of lines) {
      const trimmed = line.trim();
      if (trimmed.toLowerCase().includes('final answer') || trimmed.startsWith('**4.')) {
        finalAnswer = trimmed;
      } else if (trimmed.length > 10 && !trimmed.startsWith('#')) {
        steps.push(trimmed);
      }
    }
    
    return {
      steps: steps.length >= 2 ? steps : ["Analyzing the problem...", "Applying mathematical principles...", "Computing the solution..."],
      final_answer: finalAnswer || "See explanation above",
      topic: "Math",
      full_response: content
    };
  }
};

// Extract steps from markdown content
const extractStepsFromMarkdown = (content) => {
  const steps = [];
  const lines = content.split('\n');
  let inStepSection = false;
  
  for (const line of lines) {
    const trimmed = line.trim();
    
    // Look for Step-by-Step Solution section
    if (trimmed.includes('Step-by-Step') || trimmed.includes('**3.')) {
      inStepSection = true;
      continue;
    }
    
    // Stop at Final Answer section
    if (trimmed.includes('Final Answer') || trimmed.includes('**4.')) {
      inStepSection = false;
      break;
    }
    
    if (inStepSection && trimmed && !trimmed.startsWith('#')) {
      steps.push(trimmed);
    }
  }
  
  return steps.length > 0 ? steps : [content.substring(0, 500)];
};

// Extract final answer from content
const extractFinalAnswer = (content) => {
  const finalAnswerMatch = content.match(/\*\*Final Answer:\*\*([^\n]+)/i);
  if (finalAnswerMatch) {
    return finalAnswerMatch[1].trim();
  }
  
  const boldMatch = content.match(/\*\*([^*]+)\*\*$/m);
  if (boldMatch) {
    return boldMatch[1].trim();
  }
  
  return "See full solution above";
};

module.exports = { solveWithGroq, solveWithGroqVision };