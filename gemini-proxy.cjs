const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

const GEMINI_API_KEY = '';
const GEMINI_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';

app.post('/api/gemini', async (req, res) => {
  try {
    const userPrompt = req.body.prompt;
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
        }
      }
    );
    const aiText = response.data.candidates[0]?.content?.parts[0]?.text || 'No response';
    res.json({ text: aiText });
  } catch (err) {
    console.error('Gemini API error:', err.response?.data || err.message || err);
    res.status(500).json({ error: err.response?.data || err.message || err });
  }
});

app.listen(PORT, () => console.log(`Gemini proxy running on http://localhost:${PORT}`));