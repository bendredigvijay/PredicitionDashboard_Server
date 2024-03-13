const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');
const { authenticateToken } = require('./middleware/authMiddleware');
const app = express();

// Use the built-in express.json() middleware instead of body-parser
app.use(express.json());

// Enable CORS
app.use(cors());

// Include your auth routes
app.use('/api/auth', authRoutes);

// Protected route example
app.get('/api/protected', authenticateToken, (req, res) => {
  res.json({ message: 'This is a protected route!', user: req.user });
});

app.listen(5000, () => {
  console.log('Server is running on port 5000');
});

module.exports = app;
