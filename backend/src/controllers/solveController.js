const solveWithGroq = require('../services/groqService');
const { extractText, deleteFile } = require('../utils/ocrService');

// PART 4 — FALLBACK EVALUATOR (ONLY IF AI FAILS)
const evaluateExpression = (expr) => {
  try {
    const cleaned = expr.replace(/[^0-9+\-*/().]/g, "").replace(/[+\-*/]+$/, "");
    if (!cleaned || cleaned.length < 2) return null;
    return Function(`"use strict"; return (${cleaned})`)();
  } catch {
    return null;
  }
};

async function solveProblem(req, res) {
  try {
    console.log("FILE:", req.file);
    
    const imagePath = req.file ? req.file.path : null;
    let question = req.body.question;
    
    if (imagePath) {
      const extractedText = await extractText(imagePath);
      deleteFile(imagePath);
      
      console.log("EXTRACTED:", extractedText);
      
      if (!extractedText || extractedText.trim().length === 0) {
        return res.status(400).json({
          success: false,
          message: "No readable math problem detected"
        });
      }
      
      question = extractedText;
    }
    
    if (!question || question.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: "No math problem provided"
      });
    }
    
    // PART 3 — USE AI AS PRIMARY SOLVER
    let result = null;
    
    try {
      result = await solveWithGroq(question);
    } catch (aiError) {
      console.error("AI FAILED:", aiError.message);
    }
    
    // PART 4 — FALLBACK IF AI FAILS
    if (!result) {
      const fallback = evaluateExpression(question);
      
      return res.json({
        success: true,
        question,
        steps: [`Evaluating ${question}`],
        finalAnswer: fallback ? fallback.toString() : "Could not solve"
      });
    }
    
    // Return AI result
    res.json({
      success: true,
      question,
      steps: result.steps || ["Step-by-step solution"],
      finalAnswer: result.final_answer || "See steps"
    });
    
  } catch (error) {
    if (req.file && req.file.path) {
      deleteFile(req.file.path);
    }
    
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
}

module.exports = { solveProblem };
