const express = require("express");
const axios = require("axios");
const solveWithGroq = require("../services/groqService");

const router = express.Router();

// PART 7 — GENERATE PRACTICE QUESTION
router.post("/practice", async (req, res) => {
  const { original } = req.body;

  try {
    const response = await axios.post(
      'https://api.groq.com/openai/v1/chat/completions',
      {
        model: "llama-3.1-8b-instant",
        messages: [
          {
            role: "system",
            content: `
You are a math teacher.

CRITICAL: You MUST generate a real, unique math problem. Do NOT output placeholder text or schema definitions. You must fill the response with the actual generated math problem text.

Generate ONLY ONE similar math question.

Rules:
- DO NOT explain
- DO NOT solve
- DO NOT add steps
- ONLY output the question text
- Keep it clean and simple
- Generate a REAL math problem, not placeholder text

Example:
Input: x^2 - 2x - 15
Output: x^2 - 4x - 21

You must output ONLY the question text. Do not wrap the response in markdown code blocks (no \`\`\`). Do not include any conversational text before or after the question.
          `
          },
          {
            role: "user",
            content: `Original problem: ${original}` 
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

    let question = response.data.choices[0].message.content.trim();

    // Remove unwanted sentences if AI misbehaves
    question = question.split("\n")[0];

    res.json({ question });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to generate practice question" });
  }
});

// PART 8 — CHECK ANSWER
router.post("/check-answer", async (req, res) => {
  const { question, answer } = req.body;

  // Fallback evaluator
  const evaluateExpression = (expr) => {
    try {
      return Function(`"use strict"; return (${expr})`)();
    } catch {
      return null;
    }
  };

  try {
    const response = await axios.post(
      'https://api.groq.com/openai/v1/chat/completions',
      {
        model: "llama-3.1-8b-instant",
        messages: [
          {
            role: "system",
            content: `
You are a math evaluator.

Return ONLY valid JSON:

{
  "correct": true or false,
  "correct_answer": "final simplified answer only",
  "steps": ["step1", "step2"],
  "explanation": "short explanation"
}

Do not include anything outside JSON.

You must output ONLY raw, valid JSON. Do not wrap the response in markdown code blocks (no \`\`\`json). Do not include any conversational text before or after the JSON object.
`
          },
          {
            role: "user",
            content: `
Question: ${question}
Student Answer: ${answer}
`
          }
        ],
        temperature: 0
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
      let text = response.data.choices[0].message.content;
      
      // Strip markdown code blocks if the AI still includes them
      text = text.replace(/```json/g, '').replace(/```/g, '').trim();
      
      // Extract only the JSON object using regex
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error("No valid JSON object found in AI response.");
      }
      
      parsed = JSON.parse(jsonMatch[0]);

    } catch (err) {
      console.error("AI JSON parse failed:", err.message);
      parsed = null;
    }

    // PART 4 — IF AI FAILS → FALLBACK
    if (!parsed || !parsed.correct_answer) {
      return res.json({
        correct: false,
        correct_answer: "See explanation above",
        steps: ["AI evaluation failed, please check manually"],
        explanation: "Could not automatically evaluate. Your answer may still be correct."
      });
    }

    // Ensure all values are strings
    parsed.correct_answer = String(parsed.correct_answer || "");
    parsed.explanation = String(parsed.explanation || "");
    
    // Ensure steps is array of strings
    if (Array.isArray(parsed.steps)) {
      parsed.steps = parsed.steps.map(step => String(step));
    } else {
      parsed.steps = [];
    }

    res.json(parsed);

  } catch (err) {
    console.error(err);
    res.json({
      correct: false,
      correct_answer: "See explanation",
      steps: ["Evaluation service temporarily unavailable"],
      explanation: "Please verify your answer manually or try again."
    });
  }
});

module.exports = router;
