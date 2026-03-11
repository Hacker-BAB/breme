// src/index.js — Serveur principal BREME
require('dotenv').config();
const express = require('express');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const path = require('path');

const app = express();

// ============================================
// 🔐 CORS — EN TOUT PREMIER (avant helmet)
// ============================================
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS,PATCH');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  next();
});

// Helmet : protège les headers HTTP (CORS désactivé dans helmet)
app.use(helmet({
  crossOriginResourcePolicy: false,
  crossOriginOpenerPolicy: false,
  crossOriginEmbedderPolicy: false
}));

// Rate limiting : max 100 requêtes / 15 min par IP
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { success: false, message: 'Trop de requêtes. Réessayez dans 15 minutes.' }
});
app.use('/api/', limiter);

// Rate limiting strict pour l'auth : 10 tentatives / 15 min
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { success: false, message: 'Trop de tentatives de connexion. Réessayez plus tard.' }
});
app.use('/api/auth/login', authLimiter);
app.use('/api/auth/register', authLimiter);

// Parser JSON
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// ============================================
// 🛣️ ROUTES
// ============================================
app.use('/api/auth', require('./routes/auth'));
app.use('/api/payments', require('./routes/payments'));
app.use('/api/trucks', require('./routes/trucks'));
app.use('/api/drivers', require('./routes/drivers'));
app.use('/api/documents', require('./routes/documents'));
app.use('/api/admin', require('./routes/admin'));

// Route de santé
app.get('/api/health', (req, res) => {
  res.json({ 
    success: true, 
    message: '🚛 BREME API en ligne', 
    version: '1.0.0',
    timestamp: new Date().toISOString()
  });
});

// ============================================
// 🖥️ FRONTEND (production)
// ============================================
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../../frontend/build')));
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../../frontend/build/index.html'));
  });
}

// Gestion erreurs globale
app.use((err, req, res, next) => {
  console.error('Erreur:', err.stack);
  res.status(500).json({ success: false, message: 'Erreur interne du serveur.' });
});

// ============================================
// 🚀 DÉMARRAGE
// ============================================
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`
  ╔══════════════════════════════════════╗
  ║   🚛  BREME API démarrée            ║
  ║   Port    : ${PORT}                      ║
  ║   Env     : ${process.env.NODE_ENV || 'development'}            ║
  ║   URL     : http://localhost:${PORT}    ║
  ╚══════════════════════════════════════╝
  `);
});

module.exports = app;
