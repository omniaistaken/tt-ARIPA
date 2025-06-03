require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const statsRoutes = require('./routes/stats');

app.use(cors());
app.use(express.json());

app.use('/api/stats', statsRoutes);

const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => {
  res.send('API Stats ARIPA — Dispo sur /api/stats/*');
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));