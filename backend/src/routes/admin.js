// src/routes/admin.js
const express = require('express');
const pool = require('../config/database');
const { protect, requireAdmin } = require('../middleware/auth');

const router = express.Router();
router.use(protect, requireAdmin);

// GET /api/admin/dashboard
router.get('/dashboard', async (req, res) => {
  try {
    const [users, payments, trucks, drivers] = await Promise.all([
      pool.query('SELECT COUNT(*) FROM users WHERE role != $1', ['admin']),
      pool.query("SELECT COUNT(*) FROM payments WHERE status = 'confirmed'"),
      pool.query('SELECT COUNT(*) FROM trucks'),
      pool.query('SELECT COUNT(*) FROM drivers')
    ]);

    const revenue = await pool.query(
      "SELECT COALESCE(SUM(amount),0) as total FROM payments WHERE status = 'confirmed'"
    );

    res.json({
      success: true,
      stats: {
        total_users: parseInt(users.rows[0].count),
        total_payments: parseInt(payments.rows[0].count),
        total_trucks: parseInt(trucks.rows[0].count),
        total_drivers: parseInt(drivers.rows[0].count),
        total_revenue_fcfa: parseInt(revenue.rows[0].total)
      }
    });
  } catch (e) { res.status(500).json({ success: false, message: 'Erreur serveur.' }); }
});

// GET /api/admin/users
router.get('/users', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT id,name,email,role,subscription_status,subscription_end,created_at FROM users ORDER BY created_at DESC'
    );
    res.json({ success: true, users: result.rows });
  } catch (e) { res.status(500).json({ success: false, message: 'Erreur serveur.' }); }
});

// PUT /api/admin/users/:id/suspend
router.put('/users/:id/suspend', async (req, res) => {
  try {
    await pool.query(
      "UPDATE users SET subscription_status='suspended', updated_at=NOW() WHERE id=$1",
      [req.params.id]
    );
    res.json({ success: true, message: 'Compte suspendu.' });
  } catch (e) { res.status(500).json({ success: false, message: 'Erreur serveur.' }); }
});

// PUT /api/admin/users/:id/activate
router.put('/users/:id/activate', async (req, res) => {
  try {
    const endDate = new Date();
    endDate.setDate(endDate.getDate() + 30);
    await pool.query(
      "UPDATE users SET subscription_status='active', subscription_end=$1, updated_at=NOW() WHERE id=$2",
      [endDate, req.params.id]
    );
    res.json({ success: true, message: 'Abonnement activé.' });
  } catch (e) { res.status(500).json({ success: false, message: 'Erreur serveur.' }); }
});

// DELETE /api/admin/users/:id
router.delete('/users/:id', async (req, res) => {
  try {
    await pool.query('DELETE FROM users WHERE id=$1 AND role != $2', [req.params.id, 'admin']);
    res.json({ success: true, message: 'Utilisateur supprimé.' });
  } catch (e) { res.status(500).json({ success: false, message: 'Erreur serveur.' }); }
});

module.exports = router;
