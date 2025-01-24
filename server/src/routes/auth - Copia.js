const express = require('express');
const router = express.Router();
const User = require('../models/User');
const jwt = require('jsonwebtoken');

const SECRET_KEY = 'your-secret-key'; // In produzione, usa una variabile d'ambiente

router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    // Trova l'utente
    const user = await User.findOne({ username });

    // Verifica credenziali
    if (!user || user.password !== password) {
      return res.status(401).json({
        message: 'Credenziali non valide'
      });
    }

    // Verifica che l'utente sia attivo
    if (!user.active) {
      return res.status(403).json({
        message: 'Account disattivato'
      });
    }

    // Genera token
    const token = jwt.sign(
      {
        userId: user._id,
        role: user.role,
        username: user.username
      },
      SECRET_KEY,
      { expiresIn: '24h' }
    );

    // Rimuovi la password dai dati utente
    const userResponse = user.toObject();
    delete userResponse.password;

    res.json({
      user: userResponse,
      token
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      message: 'Errore del server'
    });
  }
});

// Middleware per verificare il token
const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({
      message: 'Token non fornito'
    });
  }

  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({
      message: 'Token non valido'
    });
  }
};

// Route protetta di esempio per verificare il token
router.get('/me', verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select('-password');
    if (!user) {
      return res.status(404).json({
        message: 'Utente non trovato'
      });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({
      message: 'Errore del server'
    });
  }
});

module.exports = router;
