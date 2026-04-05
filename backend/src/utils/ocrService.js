const { createWorker } = require("tesseract.js");
const fs = require("fs");

async function extractText(imagePath) {
  const worker = await createWorker("eng");
  try {
    const { data: { text } } = await worker.recognize(imagePath);
    await worker.terminate();
    
    let cleaned = text
      .replace(/\n/g, " ")
      .replace(/\s+/g, " ")
      .trim();
    
    cleaned = cleaned
      .replace(/×/g, "*")
      .replace(/÷/g, "/")
      .replace(/[–—]/g, "-")
      .replace(/[\"']/g, "")
      .replace(/[^\w\s+\-=\/*^().0-9]/g, "");
    
    return cleaned;
  } catch (error) {
    await worker.terminate();
    throw error;
  }
}

function deleteFile(filePath) {
  try {
    fs.unlinkSync(filePath);
  } catch (error) {
    console.error("Cleanup failed:", error.message);
  }
}

module.exports = { extractText, deleteFile };
