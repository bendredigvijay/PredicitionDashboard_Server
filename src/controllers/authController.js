const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../Models/userModel');

// Predefined hardcoded fuel data and weather data
const fuelData = [
  { country: 'Brazil', meFuelCones: '1800.00 kg/h', aeFuelCones: '150.85 kg/h', meRPM: '65.40 rpm ME RPM', tcRPM: '450.00 V DG1 Volt. UV' },
];

const actualFuelData = [
  { country: 'Brazil', meFuelCones: '988.00 kg/h', aeFuelCones: '250.85 kg/h', meRPM: '75.40 rpm ME RPM', tcRPM: '950.00 V DG1 Volt. UV' },
];

const generateToken = (user) => {
  return jwt.sign({ username: user.username, email: user.email }, 'your-secret-key', { expiresIn: '1h' });
};

// Registration function with email
exports.register = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Check if the email already exists in the database
    const checkEmailQuery = 'SELECT * FROM users WHERE email = ?';
    db.get(checkEmailQuery, [email], async (err, existingUser) => {
      if (err) {
        console.error('Error checking existing user:', err.message);
        return res.status(500).json({ error: 'Internal Server Error' });
      }

      if (existingUser) {
        // User with the given email already exists
        return res.status(400).json({ error: 'Email already registered, Please Login' });
      }

      // If the email doesn't exist, proceed with registration
      const hashedPassword = await bcrypt.hash(password, 10);

      const insertUserQuery = 'INSERT INTO users (username, email, password) VALUES (?, ?, ?)';
      db.run(insertUserQuery, [username, email, hashedPassword], (insertErr) => {
        if (insertErr) {
          console.error('Error during user registration:', insertErr.message);
          return res.status(500).json({ error: 'Internal Server Error' });
        }

        res.status(200).json({ message: 'Registration successful' });
      });
    });
  } catch (error) {
    console.error('Error during user registration:', error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Login function with JWT token generation
exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;

    const query = 'SELECT * FROM users WHERE username = ?';
    db.get(query, [username], async (err, user) => {
      if (err) {
        console.error('Error during login:', err.message);
        return res.status(500).json({ error: 'Internal Server Error' });
      }

      if (!user) {
        return res.status(401).json({ error: 'Invalid username or password' });
      }

      const isPasswordValid = await bcrypt.compare(password, user.password);

      if (isPasswordValid) {
        // Generate JWT token
        const token = generateToken(user);

        res.status(200).json({ message: 'Login successful', token });
      } else {
        res.status(401).json({ error: 'Invalid username or password' });
      }
    });
  } catch (error) {
    console.error('Error during login:', error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Existing fetchFuelAndWeatherData function
exports.fetchFuelAndWeatherData = (req, res) => {
  try {
    const weatherData = {
      date: {
        '2024-01-02': 'good',
        '2024-01-17': 'moderate',
        '2024-01-23': 'bad',
      },
    };
    res.json({ fuelData, actualFuelData, weatherData });
  } catch (error) {
    console.error('Error fetching fuel and weather data:', error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
