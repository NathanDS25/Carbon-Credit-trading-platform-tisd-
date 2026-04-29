const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });
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
app.use('/api/users', require('./routes/userRoutes'));

// Root route
app.get('/', (req, res) => {
  res.send('CarbonX API is running...');
});

// Error Handler
app.use(errorHandler);

app.listen(PORT, async () => {
  console.log(`Server running on port ${PORT}`);
  
  // Database Connection Test
  try {
    const prisma = require('./config/prisma');
    console.log('⏳ Testing database connection...');
    const userCount = await prisma.user.count();
    console.log(`✅ Database connected! User count: ${userCount}`);
  } catch (error) {
    console.error('❌ Database connection failed during startup!');
    console.error(error.message);
  }
});
