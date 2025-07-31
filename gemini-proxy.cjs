const express = require('express');
const axios = require('axios');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

// Load API key from environment or set directly
const GEMINI_API_KEY = process.env.GEMINI_API_KEY || 'AIzaSyB61Ls7-aeMtyuNJtWPj0VZVmdEVV80Axw';

console.log(' API Key loaded:', GEMINI_API_KEY ? 'Yes (' + GEMINI_API_KEY.substring(0, 10) + '...)' : 'No');

if (!GEMINI_API_KEY || GEMINI_API_KEY === 'AIzaSyB61Ls7-aeMtyuNJtWPj0VZVmdEVV80Axw') {
  console.warn('  GEMINI_API_KEY not set! Please set your API key in environment variable or directly in the code.');
}
const GEMINI_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';

app.post('/api/gemini', async (req, res) => {
  try {
    console.log('💬 Received request:', req.body);
    
    const userPrompt = req.body.prompt;
    if (!userPrompt) {
      return res.status(400).json({ error: 'No prompt provided' });
    }
    
    console.log('🤖 Sending to Gemini:', userPrompt.substring(0, 50) + '...');
    
    const payload = {
      contents: [{ parts: [{ text: userPrompt }] }]
    };
    
    const response = await axios.post(
      GEMINI_URL,
      payload,
      {
        headers: {
          'Content-Type': 'application/json',
          'X-goog-api-key': GEMINI_API_KEY
        },
        timeout: 30000 // 30 second timeout
      }
    );
    
    console.log('✅ Gemini response received');
    const aiText = response.data.candidates[0]?.content?.parts[0]?.text || 'No response';
    console.log('📝 Response text:', aiText.substring(0, 100) + '...');
    
    res.json({ text: aiText });
  } catch (err) {
    console.error('❌ Gemini API error:');
    console.error('Status:', err.response?.status);
    console.error('Data:', err.response?.data);
    console.error('Message:', err.message);
    
    // Send a more user-friendly error response
    const errorMessage = err.response?.data?.error?.message || 
                        err.response?.data?.message || 
                        err.message || 
                        'Unknown error occurred';
    
    res.status(500).json({ 
      error: 'Sorry, I encountered an error while processing your request.',
      details: errorMessage
    });
  }
});

app.listen(PORT, () => console.log(`Gemini proxy running on http://localhost:${PORT}`));