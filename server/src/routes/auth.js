// server/src/routes/auth.js

const express = require('express');
const router = express.Router();
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');

// Validazione
const loginValidation = [
  body('username')
    .trim()
    .notEmpty().withMessage('Username è obbligatorio')
    .isLength({ min: 3 }).withMessage('Username deve essere almeno 3 caratteri'),
  body('password')
    .notEmpty().withMessage('Password è obbligatoria')
    .isLength({ min: 6 }).withMessage('Password deve essere almeno 6 caratteri')
];

const validateRequest = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

const SECRET_KEY = process.env.JWT_SECRET || 'your-secret-key';

// Route login
router.post('/login', loginValidation, validateRequest, async (req, res) => {
  try {
    const { username, password } = req.body;

    // Trova l'utente
    const user = await User.findOne({ username });

    // Verifica credenziali
    if (!user || user.password !== password) {
      return res.status(401).json({
        success: false,
        message: 'Credenziali non valide'
      });
    }

    // Verifica che l'utente sia attivo
    if (!user.active) {
      return res.status(403).json({
        success: false,
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
      success: true,
      data: {
        user: userResponse,
        token
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Errore del server'
    });
  }
});

// Middleware per verificare il token
const verifyToken = (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Token non fornito'
      });
    }

    const decoded = jwt.verify(token, SECRET_KEY);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Token non valido'
    });
  }
};

// Middleware per verificare il ruolo
const checkRole = (roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: 'Accesso non autorizzato'
      });
    }
    next();
  };
};

// Route per ottenere i dati dell'utente corrente
router.get('/me', verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select('-password');
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Utente non trovato'
      });
    }
    res.json({
      success: true,
      data: user
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Errore del server'
    });
  }
});

// Route esempio per utenti ufficio
router.get('/office-data', verifyToken, checkRole(['ufficio']), async (req, res) => {
  try {
    res.json({
      success: true,
      data: { message: 'Dati ufficio' }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Errore del server'
    });
  }
});

module.exports = router;
