require('dotenv').config();
const express = require('express');
const cors = require('cors');
const errorHandler = require('./middleware/errorHandler');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes (to be implemented)
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/plantations', require('./routes/plantationRoutes'));
app.use('/api/marketplace', require('./routes/marketplaceRoutes'));
app.use('/api/heatmap', require('./routes/heatmapRoutes'));
app.use('/api/chat', require('./routes/chatRoutes'));
app.use('/api/meetings', require('./routes/meetingRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));

// Root route
app.get('/', (req, res) => {
  res.send('CarbonX API is running...');
});

// Error Handler
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
