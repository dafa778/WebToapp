const express = require('express');
const cors = require('cors');
const axios = require('axios');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 8080;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Home route
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Build API
app.post('/api/build', async (req, res) => {
  const { url, email, name } = req.body;
  const apiKey = process.env.API_KEY || 'bagus';

  if (!url || !email || !name) {
    return res.status(400).json({
      status: false,
      message: 'Missing required parameters.'
    });
  }

  const apiURL = `https://web2apk-cg.zone.id/tools/web2app?apikey=${apiKey}&url=${encodeURIComponent(url)}&email=${encodeURIComponent(email)}&name=${encodeURIComponent(name)}`;

  try {
    const response = await axios.get(apiURL, {
      timeout: 300000,
      validateStatus: () => true
    });

    // Kalau bukan JSON
    if (typeof response.data !== 'object') {
      return res.status(500).json({
        status: false,
        message: 'External API did not return valid JSON.'
      });
    }

    return res.json(response.data);

  } catch (err) {
    console.error('Error calling external API:', err.message);
    return res.status(500).json({
      status: false,
      message: 'Failed to contact external API.'
    });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});

module.exports = app;
