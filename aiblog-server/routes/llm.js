import express from 'express';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { createPrompt } from '../helpers/llmHelpers.js';

const llmRouter = express.Router();

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
if (!GEMINI_API_KEY) {
  console.error('ERROR: GEMINI_API_KEY is not defined in .env file.');
}

const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

llmRouter.post('/generate', async (req, res) => {
  try {
    const { selectedItems, notes } = req.body;
    if (!selectedItems || !Array.isArray(selectedItems) || selectedItems.length === 0) {
      return res.status(400).json({ message: 'No items selected for generation.' });
    }

    const prompt = createPrompt(selectedItems, notes || {});
    
    const result = await model.generateContent(prompt);
    const response = result.response;
    const text = response.text();

    res.json({ text });

  } catch (error) {
    console.error('LLM Generation Error:', error);
    res.status(500).json({ 
      message: 'Failed to generate content from LLM.', 
      details: error.message 
    });
  }
});

export default llmRouter;