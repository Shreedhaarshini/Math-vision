const express = require("express");
const axios = require("axios");

const router = express.Router();

// Expert Math Tutor System Prompt
const EXPERT_MATH_TUTOR_PROMPT = `You are an expert, highly encouraging math tutor. Your goal is to help students understand the "why" and "how" of math, not just give the answer. When given a math problem (via text or image), you must structure your response EXACTLY like this:

**1. Concept Overview:** Briefly explain the core math concept needed to solve this (e.g., "To find the volume of a cylinder, we need...").

**2. Given Information:** List out the variables we already know.

**3. Step-by-Step Solution:** Break the math down into small, logical steps. Explain what you are doing before you write the equation. Use standard LaTeX formatting for ALL math. Use \\( ... \\) for inline math and \\[ ... \\] for standalone block equations.

**4. Final Answer:** Clearly state the final answer in bold.

Additionally, you MUST return a valid JSON object with these fields:
{
  "topic": "The math topic (e.g., Algebra, Calculus, Trigonometry)",
  "steps": ["Array of step strings with LaTeX"],
  "final_answer": "The final answer with LaTeX",
  "practice_question": "A similar practice question",
  "practice_answer": "The answer to the practice question"
}

Rules:
- Always be encouraging and supportive
- Explain concepts clearly before showing calculations
- Use LaTeX for ALL mathematical expressions
- Return the response in markdown format with the JSON at the end`;

// Universal AI Math Solver
router.post("/solve-universal", async (req, res) => {
  const { question, messages } = req.body;

  try {
    // If frontend sends messages array (for practice questions), use it directly
    // Otherwise, construct messages from question for regular solving
    const requestMessages = messages || [
      {
        role: "system",
        content: EXPERT_MATH_TUTOR_PROMPT
      },
      {
        role: "user",
        content: `Please solve this math problem step by step. Problem: ${question}` 
      }
    ];

    const response = await axios.post(
      'https://api.groq.com/openai/v1/chat/completions',
      {
        model: "meta-llama/llama-4-scout-17b-16e-instruct",
        messages: requestMessages,
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

    let parsed;

    try {
      const text = response.data.choices[0].message.content;

      // Try to extract JSON from the response
      const jsonStart = text.indexOf("{");
      const jsonEnd = text.lastIndexOf("}");

      if (jsonStart !== -1 && jsonEnd !== -1) {
        parsed = JSON.parse(text.substring(jsonStart, jsonEnd + 1));
      } else {
        throw new Error("No JSON found in response");
      }

    } catch (err) {
      console.error("AI parsing failed:", err.message);

      // Fallback: create structured response from text
      const text = response.data.choices[0].message.content;
      const lines = text.split('\n').filter(line => line.trim());
      const steps = [];
      let finalAnswer = "";
      
      for (const line of lines) {
        const trimmed = line.trim();
        if (trimmed.toLowerCase().includes('final answer') || trimmed.startsWith('**4.')) {
          finalAnswer = trimmed;
        } else if (trimmed.length > 10 && !trimmed.startsWith('{') && !trimmed.startsWith('}')) {
          steps.push(trimmed);
        }
      }
      
      parsed = {
        topic: "Math",
        steps: steps.length > 0 ? steps : ["Analyzing the problem...", "Applying mathematical principles...", "Computing the solution..."],
        final_answer: finalAnswer || "See solution above",
        practice_question: "",
        practice_answer: "",
        full_response: text
      };
    }

    // Ensure steps are strings
    if (Array.isArray(parsed.steps)) {
      parsed.steps = parsed.steps.map(s => {
        if (typeof s === "object" && s !== null) {
          return `${s.step || ""} ${s.math || ""}`.trim();
        }
        return String(s);
      });
    }

    res.json(parsed);

  } catch (err) {
    console.error("Universal solver error:", err);
    res.json({
      topic: "Math",
      steps: ["Service temporarily unavailable"],
      final_answer: "Error",
      practice_question: "",
      practice_answer: ""
    });
  }
});

module.exports = router;
