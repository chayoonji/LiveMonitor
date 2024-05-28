const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.static(path.join(__dirname, '../client/dist')));

app.get('/api/message', (req, res) => {
  res.json({ message: 'Backend says hello to frontend!' });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
