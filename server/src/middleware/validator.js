// server/src/middleware/validator.js
const { body, validationResult } = require('express-validator');

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

module.exports = { loginValidation, validateRequest };
