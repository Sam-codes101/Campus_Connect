const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const seedInitialData = require('./utils/seedData');

// Load environment variables
dotenv.config();

// Initialize express app
const app = express();

// Connect to Database & Seed Sample College Data
(async () => {
  await connectDB();
  await seedInitialData();
})();

// CORS setup
const allowedOrigins = [
  process.env.CLIENT_URL,
  'http://localhost:5175',
  'http://localhost:5173',
  'http://localhost:3000'
].filter(Boolean);

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(null, true); // Permissive for local college testing
    }
  },
  credentials: true,
}));

// Body parsers (supports base64 image strings up to 10MB)
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Development Request Logger
app.use((req, res, next) => {
  console.log(`[${new Date().toLocaleTimeString()}] ${req.method} ${req.url}`);
  next();
});

// Mount Routes
app.use('/api/health', require('./routes/health'));
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/resources', require('./routes/resourceRoutes'));
app.use('/api/lost-found', require('./routes/lostFoundRoutes'));
app.use('/api/posts', require('./routes/postRoutes'));
app.use('/api/updates', require('./routes/updateRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));

const path = require('path');
const fs = require('fs');

// In production, serve the built React frontend if dist exists
const clientDistPath = path.join(__dirname, '../client/dist');
if (fs.existsSync(clientDistPath)) {
  app.use(express.static(clientDistPath));

  app.get('*', (req, res, next) => {
    if (req.url.startsWith('/api')) {
      return next();
    }
    res.sendFile(path.join(clientDistPath, 'index.html'));
  });
} else {
  // Root endpoint in API-only dev mode
  app.get('/', (req, res) => {
    res.json({
      name: 'Campus Connect REST API',
      status: 'online',
      version: '1.0.0',
      endpoints: [
        '/api/health',
        '/api/auth',
        '/api/users',
        '/api/resources',
        '/api/lost-found',
        '/api/posts',
        '/api/updates',
        '/api/admin',
      ],
    });
  });
}

// 404 Not Found handler for unhandled API routes
app.use((req, res, next) => {
  res.status(404).json({
    status: 'error',
    message: `Endpoint ${req.originalUrl} not found on this server.`,
  });
});

// Centralized Global Error Handler
app.use((err, req, res, next) => {
  console.error('Server Exception:', err);
  res.status(err.status || 500).json({
    status: 'error',
    message: err.message || 'Internal Server Error',
  });
});

// Start Server
const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
  console.log(`===============================================`);
  console.log(`🚀 Campus Connect Server running on port ${PORT}`);
  console.log(`🌐 Base URL: http://localhost:${PORT}`);
  console.log(`🩺 Health:   http://localhost:${PORT}/api/health`);
  console.log(`===============================================`);
});

module.exports = app;
