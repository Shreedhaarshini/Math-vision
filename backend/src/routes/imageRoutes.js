const express = require("express");
const upload = require("../middleware/upload");
const { solveWithGroq, solveWithGroqVision } = require("../services/groqService");

const router = express.Router();

// Main router with Vision AI
router.post("/solve-image", upload.single("image"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No image uploaded" });
    }

    console.log("Processing image with Vision AI:", req.file.path);

    // Use Vision API to solve directly from image
    let result = null;
    
    try {
      result = await solveWithGroqVision(req.file.path);
      console.log("Vision AI result:", result);
    } catch (visionError) {
      console.error("VISION AI FAILED:", visionError.message);
      
      // Fallback: try text-based solving if vision fails
      try {
        const Tesseract = require("tesseract.js");
        const { data: { text } } = await Tesseract.recognize(req.file.path, "eng");
        const expression = text.replace(/\n/g, " ").trim();
        console.log("OCR fallback text:", expression);
        result = await solveWithGroq(expression);
      } catch (ocrError) {
        console.error("OCR fallback failed:", ocrError.message);
      }
    }

    // Final fallback
    if (!result) {
      return res.json({
        topic: "Math",
        steps: ["Could not process image"],
        final_answer: "Error processing image",
        practice_question: "",
        practice_answer: ""
      });
    }

    // Ensure practice fields exist
    if (!result.practice_question) {
      result.practice_question = "";
      result.practice_answer = "";
    }

    return res.json(result);

  } catch (err) {
    console.error("Image processing error:", err);
    res.status(500).json({ 
      error: "Image processing failed",
      topic: "Math",
      steps: ["Service temporarily unavailable"],
      final_answer: "Error",
      practice_question: "",
      practice_answer: ""
    });
  }
});

module.exports = router;
