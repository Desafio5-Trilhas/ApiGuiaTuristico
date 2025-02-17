const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');

const verifyApiKey = async (req, res, next) => {
  const apiKey = req.headers['x-api-key'];

  if (!apiKey) {
    return res.status(403).json({ error: 'API Key não fornecida' });
  }
  if (apiKey != process.env.API_KEY) {
    return res.status(401).json({ error: 'API Key inválida' });
  }
  next();
};

const verifyToken = (req, res, next) => {
  const token = req.headers['authorization'];

  if (!token) {
    return res.status(403).json({ error: 'Token de acesso não fornecido' });
  }
  try {
    const decoded = jwt.verify(token.split(' ')[1], process.env.SECRET_KEY); // O token pode vir com o prefixo "Bearer "
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Token de acesso inválido' });
  }
};

const validateData = (req, res, next) => {
  const errors = validationResult(req);
  if (errors.isEmpty()) {
    return next();
  }
  const errorsTratados = [];
  errors.array().map((err) => errorsTratados.push({ [err.path]: err.msg }));

  return res.status(422).json({ errors: errorsTratados });
};

module.exports = {
  verifyApiKey,
  verifyToken,
  validateData,
};
