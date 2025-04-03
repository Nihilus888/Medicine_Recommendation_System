require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db'); // Import database connection
const logger = require('./config/logger'); // Import logger
const speckleRoutes = require('./routes/speckleRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api', speckleRoutes);

// Start Server
app.listen(PORT, () => logger.info(`🚀 Server running on http://localhost:${PORT}`));
