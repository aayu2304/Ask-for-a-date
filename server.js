const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const port = process.env.PORT || 3000;
const dataFile = path.join(__dirname, 'responses.json');

app.use(express.json());
app.use(express.static(__dirname));

function loadResponses() {
  if (!fs.existsSync(dataFile)) {
    return [];
  }

  try {
    return JSON.parse(fs.readFileSync(dataFile, 'utf8'));
  } catch (error) {
    return [];
  }
}

function saveResponses(responses) {
  fs.writeFileSync(dataFile, JSON.stringify(responses, null, 2));
}

app.post('/api/responses', (req, res) => {
  const { date, time, place, food } = req.body;

  if (!date || !time || !place || !food) {
    return res.status(400).json({ error: 'All fields are required.' });
  }

  const responses = loadResponses();
  responses.unshift({
    date,
    time,
    place,
    food,
    savedAt: new Date().toISOString()
  });

  saveResponses(responses);
  res.json({ success: true });
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
