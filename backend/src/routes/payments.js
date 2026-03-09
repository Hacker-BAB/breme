// src/routes/payments.js
const express = require('express');
const axios = require('axios');
const { v4: uuidv4 } = require('uuid');
const pool = require('../config/database');
const { protect, requireAdmin } = require('../middleware/auth');

const router = express.Router();

const SUBSCRIPTION_PRICE = parseInt(process.env.SUBSCRIPTION_PRICE_FCFA) || 10000;
const SUBSCRIPTION_DAYS = parseInt(process.env.SUBSCRIPTION_DURATION_DAYS) || 30;

// ── Activer l'abonnement d'un utilisateur ──
async function activateSubscription(userId) {
  const endDate = new Date();
  endDate.setDate(endDate.getDate() + SUBSCRIPTION_DAYS);

  await pool.query(
    `UPDATE users SET 
      subscription_status = 'active',
      subscription_end = $1,
      updated_at = NOW()
     WHERE id = $2`,
    [endDate, userId]
  );
}

// ============================================
// 1️⃣ ORANGE MONEY — via PayDunya
// ============================================

// POST /api/payments/orange-money/initiate
// Initie un paiement Orange Money via PayDunya
router.post('/orange-money/initiate', protect, async (req, res) => {
  try {
    const { phone } = req.body;

    if (!phone) {
      return res.status(400).json({ success: false, message: 'Numéro de téléphone requis.' });
    }

    // ── Si tu n'as pas encore les clés PayDunya, retourne le mode manuel ──
    if (!process.env.PAYDUNYA_MASTER_KEY) {
      // Mode manuel : créer un paiement en attente
      const paymentId = uuidv4();
      await pool.query(
        `INSERT INTO payments (id, user_id, amount, method, status, notes)
         VALUES ($1, $2, $3, 'orange_money', 'pending', $4)`,
        [paymentId, req.user.id, SUBSCRIPTION_PRICE, `Paiement manuel - Tel: ${phone}`]
      );

      return res.json({
        success: true,
        mode: 'manual',
        payment_id: paymentId,
        message: `Envoyez ${SUBSCRIPTION_PRICE} FCFA au ${process.env.OM_PHONE_NUMBER} (${process.env.OM_ACCOUNT_NAME}), puis contactez-nous avec votre reçu.`,
        om_number: process.env.OM_PHONE_NUMBER,
        amount: SUBSCRIPTION_PRICE
      });
    }

    // ── Mode API PayDunya ──
    const paydunyaData = {
      invoice: {
        total_amount: SUBSCRIPTION_PRICE,
        description: `Abonnement BREME - ${req.user.name}`
      },
      store: {
        name: 'BREME',
        tagline: 'Gestion de Flotte',
        phone: process.env.OM_PHONE_NUMBER,
        postal_address: 'Cameroun'
      },
      actions: {
        cancel_url: `${process.env.FRONTEND_URL}/payment/cancel`,
        return_url: `${process.env.FRONTEND_URL}/payment/success`,
        callback_url: `${process.env.BACKEND_URL}/api/payments/orange-money/webhook`
      },
      custom_data: {
        user_id: req.user.id
      }
    };

    const response = await axios.post(
      'https://app.paydunya.com/api/v1/checkout-invoice/create',
      paydunyaData,
      {
        headers: {
          'PAYDUNYA-MASTER-KEY': process.env.PAYDUNYA_MASTER_KEY,
          'PAYDUNYA-PRIVATE-KEY': process.env.PAYDUNYA_PRIVATE_KEY,
          'PAYDUNYA-TOKEN': process.env.PAYDUNYA_TOKEN,
          'Content-Type': 'application/json'
        }
      }
    );

    // Sauvegarder le paiement en attente
    await pool.query(
      `INSERT INTO payments (id, user_id, amount, method, status, transaction_id)
       VALUES ($1, $2, $3, 'orange_money', 'pending', $4)`,
      [uuidv4(), req.user.id, SUBSCRIPTION_PRICE, response.data.token]
    );

    res.json({
      success: true,
      mode: 'api',
      invoice_url: response.data.invoice_url,
      token: response.data.token
    });

  } catch (error) {
    console.error('Erreur paiement OM:', error.message);
    res.status(500).json({ success: false, message: 'Erreur lors de l\'initiation du paiement.' });
  }
});

// POST /api/payments/orange-money/webhook — PayDunya notifie le serveur
router.post('/orange-money/webhook', async (req, res) => {
  try {
    const { data } = req.body;
    if (!data) return res.status(400).send('Bad request');

    const { custom_data, status } = data;

    if (status === 'completed' && custom_data?.user_id) {
      // Confirmer le paiement
      await pool.query(
        `UPDATE payments SET status = 'confirmed', confirmed_at = NOW()
         WHERE user_id = $1 AND method = 'orange_money' AND status = 'pending'
         ORDER BY created_at DESC LIMIT 1`,
        [custom_data.user_id]
      );

      // Activer l'abonnement
      await activateSubscription(custom_data.user_id);
      console.log(`✅ Abonnement activé pour: ${custom_data.user_id}`);
    }

    res.status(200).send('OK');
  } catch (error) {
    console.error('Erreur webhook OM:', error);
    res.status(500).send('Error');
  }
});

// ============================================
// 2️⃣ CRYPTO — via NOWPayments
// ============================================

// POST /api/payments/crypto/initiate
router.post('/crypto/initiate', protect, async (req, res) => {
  try {
    const { currency } = req.body; // 'usdttrc20', 'eth', 'btc'

    if (!['usdttrc20', 'eth', 'btc'].includes(currency)) {
      return res.status(400).json({ success: false, message: 'Crypto non supportée.' });
    }

    // ── Si pas de clé NOWPayments, mode manuel ──
    if (!process.env.NOWPAYMENTS_API_KEY) {
      const walletAddresses = {
        usdttrc20: process.env.USDT_WALLET || 'Adresse USDT à configurer',
        eth: process.env.ETH_WALLET || 'Adresse ETH à configurer',
        btc: process.env.BTC_WALLET || 'Adresse BTC à configurer'
      };

      const paymentId = uuidv4();
      await pool.query(
        `INSERT INTO payments (id, user_id, amount, method, status, notes)
         VALUES ($1, $2, $3, $4, 'pending', $5)`,
        [paymentId, req.user.id, SUBSCRIPTION_PRICE, currency, `Paiement crypto manuel - ${currency.toUpperCase()}`]
      );

      return res.json({
        success: true,
        mode: 'manual',
        payment_id: paymentId,
        wallet_address: walletAddresses[currency],
        currency: currency.toUpperCase(),
        amount_fcfa: SUBSCRIPTION_PRICE,
        message: `Envoyez l'équivalent de ${SUBSCRIPTION_PRICE} FCFA en ${currency.toUpperCase()} à l'adresse ci-dessus, puis envoyez votre TX ID.`
      });
    }

    // ── Mode API NOWPayments ──
    // D'abord récupérer le taux de change FCFA → crypto
    const rateResponse = await axios.get(
      `https://api.nowpayments.io/v1/estimate?amount=${SUBSCRIPTION_PRICE}&currency_from=xof&currency_to=${currency}`,
      { headers: { 'x-api-key': process.env.NOWPAYMENTS_API_KEY } }
    );

    const cryptoAmount = rateResponse.data.estimated_amount;

    // Créer le paiement NOWPayments
    const paymentResponse = await axios.post(
      'https://api.nowpayments.io/v1/payment',
      {
        price_amount: SUBSCRIPTION_PRICE,
        price_currency: 'xof',
        pay_currency: currency,
        order_id: `BREME-${req.user.id}-${Date.now()}`,
        order_description: `Abonnement BREME - ${req.user.name}`,
        ipn_callback_url: `${process.env.BACKEND_URL}/api/payments/crypto/webhook`,
        success_url: `${process.env.FRONTEND_URL}/payment/success`,
        cancel_url: `${process.env.FRONTEND_URL}/payment/cancel`
      },
      { headers: { 'x-api-key': process.env.NOWPAYMENTS_API_KEY } }
    );

    const nowPayment = paymentResponse.data;

    // Sauvegarder
    await pool.query(
      `INSERT INTO payments (id, user_id, amount, method, status, transaction_id, notes)
       VALUES ($1, $2, $3, $4, 'pending', $5, $6)`,
      [uuidv4(), req.user.id, SUBSCRIPTION_PRICE, currency,
       nowPayment.payment_id,
       `${cryptoAmount} ${currency.toUpperCase()} à envoyer`]
    );

    res.json({
      success: true,
      mode: 'api',
      payment_id: nowPayment.payment_id,
      pay_address: nowPayment.pay_address,
      pay_amount: nowPayment.pay_amount,
      pay_currency: nowPayment.pay_currency,
      expiration_estimate_date: nowPayment.expiration_estimate_date
    });

  } catch (error) {
    console.error('Erreur paiement crypto:', error.message);
    res.status(500).json({ success: false, message: 'Erreur lors de l\'initiation du paiement crypto.' });
  }
});

// POST /api/payments/crypto/webhook — NOWPayments notifie le serveur
router.post('/crypto/webhook', async (req, res) => {
  try {
    const crypto = require('crypto');
    const sig = req.headers['x-nowpayments-sig'];
    const secret = process.env.NOWPAYMENTS_IPN_SECRET;

    // Vérifier la signature
    if (secret && sig) {
      const sortedBody = JSON.stringify(req.body, Object.keys(req.body).sort());
      const hash = crypto.createHmac('sha512', secret).update(sortedBody).digest('hex');
      if (hash !== sig) {
        return res.status(401).send('Signature invalide');
      }
    }

    const { payment_status, order_id } = req.body;

    if (payment_status === 'finished' || payment_status === 'confirmed') {
      // Extraire le user_id depuis l'order_id
      const userId = order_id.split('-')[1];

      await pool.query(
        `UPDATE payments SET status = 'confirmed', confirmed_at = NOW(), transaction_id = $1
         WHERE user_id = $2 AND status = 'pending'
         ORDER BY created_at DESC LIMIT 1`,
        [req.body.payment_id, userId]
      );

      await activateSubscription(userId);
      console.log(`✅ Paiement crypto confirmé pour: ${userId}`);
    }

    res.status(200).send('OK');
  } catch (error) {
    console.error('Erreur webhook crypto:', error);
    res.status(500).send('Error');
  }
});

// ============================================
// 3️⃣ ADMIN — Confirmer paiement manuellement
// ============================================

// GET /api/payments/pending — Voir paiements en attente (admin)
router.get('/pending', protect, requireAdmin, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT p.*, u.name, u.email 
       FROM payments p 
       JOIN users u ON p.user_id = u.id 
       WHERE p.status = 'pending' 
       ORDER BY p.created_at DESC`
    );
    res.json({ success: true, payments: result.rows });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Erreur serveur.' });
  }
});

// PUT /api/payments/:id/confirm — Confirmer manuellement (admin)
router.put('/:id/confirm', protect, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;

    const payment = await pool.query('SELECT * FROM payments WHERE id = $1', [id]);
    if (payment.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Paiement non trouvé.' });
    }

    await pool.query(
      `UPDATE payments SET status = 'confirmed', confirmed_at = NOW(), confirmed_by = $1
       WHERE id = $2`,
      [req.user.id, id]
    );

    await activateSubscription(payment.rows[0].user_id);

    res.json({ success: true, message: 'Paiement confirmé et abonnement activé.' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Erreur serveur.' });
  }
});

// PUT /api/payments/:id/reject — Rejeter un paiement (admin)
router.put('/:id/reject', protect, requireAdmin, async (req, res) => {
  try {
    await pool.query(
      `UPDATE payments SET status = 'rejected' WHERE id = $1`,
      [req.params.id]
    );
    res.json({ success: true, message: 'Paiement rejeté.' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Erreur serveur.' });
  }
});

// GET /api/payments/my — Historique paiements de l'utilisateur connecté
router.get('/my', protect, async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT id, amount, method, status, confirmed_at, created_at FROM payments WHERE user_id = $1 ORDER BY created_at DESC',
      [req.user.id]
    );
    res.json({ success: true, payments: result.rows });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Erreur serveur.' });
  }
});

module.exports = router;
