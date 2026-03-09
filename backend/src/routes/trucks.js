// src/routes/trucks.js
const express = require('express');
const { v4: uuidv4 } = require('uuid');
const pool = require('../config/database');
const { protect, requireSubscription } = require('../middleware/auth');

const router = express.Router();
router.use(protect, requireSubscription);

// GET /api/trucks — Lister mes camions
router.get('/', async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT t.*, d.nom as driver_name, d.telephone as driver_phone
       FROM trucks t
       LEFT JOIN drivers d ON t.driver_id = d.id
       WHERE t.user_id = $1
       ORDER BY t.created_at DESC`,
      [req.user.id]
    );
    res.json({ success: true, trucks: result.rows });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Erreur serveur.' });
  }
});

// POST /api/trucks — Ajouter un camion
router.post('/', async (req, res) => {
  try {
    const { matricule, marque, modele, annee, couleur, driver_id, notes } = req.body;
    if (!matricule) return res.status(400).json({ success: false, message: 'Matricule requis.' });

    const result = await pool.query(
      `INSERT INTO trucks (id, user_id, matricule, marque, modele, annee, couleur, driver_id, notes)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9) RETURNING *`,
      [uuidv4(), req.user.id, matricule, marque, modele, annee, couleur, driver_id || null, notes]
    );
    res.status(201).json({ success: true, truck: result.rows[0] });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Erreur serveur.' });
  }
});

// PUT /api/trucks/:id — Modifier un camion
router.put('/:id', async (req, res) => {
  try {
    const { matricule, marque, modele, annee, couleur, driver_id, status, notes } = req.body;
    const result = await pool.query(
      `UPDATE trucks SET matricule=$1, marque=$2, modele=$3, annee=$4, couleur=$5,
       driver_id=$6, status=$7, notes=$8, updated_at=NOW()
       WHERE id=$9 AND user_id=$10 RETURNING *`,
      [matricule, marque, modele, annee, couleur, driver_id || null, status, notes, req.params.id, req.user.id]
    );
    if (result.rows.length === 0) return res.status(404).json({ success: false, message: 'Camion non trouvé.' });
    res.json({ success: true, truck: result.rows[0] });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Erreur serveur.' });
  }
});

// DELETE /api/trucks/:id
router.delete('/:id', async (req, res) => {
  try {
    await pool.query('DELETE FROM trucks WHERE id=$1 AND user_id=$2', [req.params.id, req.user.id]);
    res.json({ success: true, message: 'Camion supprimé.' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Erreur serveur.' });
  }
});

module.exports = router;
