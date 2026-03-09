# 🚛 BREME — SaaS Gestion de Flotte

Plateforme SaaS de gestion de camions, chauffeurs et documents pour transporteurs africains.

---

## 📁 Structure du projet

```
breme/
├── backend/                    ← Serveur Node.js + Express
│   ├── src/
│   │   ├── config/
│   │   │   ├── database.js     ← Connexion PostgreSQL
│   │   │   └── schema.sql      ← Créer les tables SQL
│   │   ├── middleware/
│   │   │   └── auth.js         ← JWT + vérification abonnement
│   │   ├── routes/
│   │   │   ├── auth.js         ← Inscription / Connexion (bcrypt)
│   │   │   ├── payments.js     ← Orange Money + Crypto
│   │   │   ├── trucks.js       ← CRUD camions
│   │   │   ├── drivers.js      ← CRUD chauffeurs
│   │   │   ├── documents.js    ← CRUD documents + alertes
│   │   │   └── admin.js        ← Dashboard admin
│   │   └── index.js            ← Serveur principal
│   ├── .env.example            ← Variables d'environnement (modèle)
│   └── package.json
│
├── frontend/                   ← Interface utilisateur
│   ├── public/
│   │   └── index.html          ← Landing page (breme.html renommé)
│   └── src/
│       ├── i18n/
│       │   └── translations.js ← Traductions FR / EN
│       ├── pages/
│       └── components/
│
└── README.md
```

---

## 🚀 Installation

### 1. Prérequis
- Node.js v18+
- PostgreSQL v14+

### 2. Base de données
```bash
# Créer la base de données
psql -U postgres -c "CREATE DATABASE breme_db;"

# Créer les tables
psql -U postgres -d breme_db -f backend/src/config/schema.sql
```

### 3. Backend
```bash
cd backend
cp .env.example .env
# Editer .env avec vos vraies valeurs

npm install
npm run dev   # développement
npm start     # production
```

### 4. Frontend
```bash
# Mettre breme.html dans frontend/public/index.html
# Ou utiliser React/Next.js avec les fichiers src/
```

---

## 🔐 Sécurité intégrée

| Mesure | Description |
|--------|-------------|
| **bcrypt** (rounds: 10) | Tous les mots de passe sont hachés |
| **JWT** | Authentification sans session serveur |
| **Helmet** | Headers HTTP sécurisés |
| **Rate Limiting** | 100 req/15min globale, 10 req/15min pour auth |
| **CORS** | Origines autorisées uniquement |
| **Validation** | Toutes les entrées validées côté serveur |

---

## 💳 Paiements

### Phase 1 (maintenant) — Manuel
- Orange Money : client envoie au +237 699 959 921
- Crypto : client envoie à l'adresse wallet
- Admin confirme manuellement dans le dashboard

### Phase 2 (avec clés API) — Automatique
1. **Orange Money / MTN** → Créer compte sur [PayDunya](https://paydunya.com)
2. **Crypto (USDT/ETH/BTC)** → Créer compte sur [NOWPayments](https://nowpayments.io)
3. Ajouter les clés dans `.env`
4. Les webhooks activent l'abonnement automatiquement ✅

---

## 🌍 Langues supportées
- 🇫🇷 Français (défaut)
- 🇬🇧 English

Fichier : `frontend/src/i18n/translations.js`

---

## 📡 API Endpoints

```
POST   /api/auth/register          Inscription
POST   /api/auth/login             Connexion
GET    /api/auth/me                Profil

POST   /api/payments/orange-money/initiate   Payer OM
POST   /api/payments/crypto/initiate         Payer Crypto
GET    /api/payments/my                      Mes paiements

GET    /api/trucks                 Mes camions
POST   /api/trucks                 Ajouter camion
PUT    /api/trucks/:id             Modifier camion
DELETE /api/trucks/:id             Supprimer camion

GET    /api/drivers                Mes chauffeurs
POST   /api/drivers                Ajouter chauffeur
PUT    /api/drivers/:id            Modifier chauffeur

GET    /api/documents              Mes documents + alertes
POST   /api/documents              Ajouter document

GET    /api/admin/dashboard        Stats (admin)
GET    /api/admin/users            Tous les utilisateurs
PUT    /api/admin/users/:id/activate   Activer abonnement
PUT    /api/admin/users/:id/suspend    Suspendre
```

---

## ☁️ Hébergement recommandé

| Service | Usage | Prix |
|---------|-------|------|
| **Railway** | Backend Node.js | Gratuit / ~5$/mois |
| **Vercel** | Frontend | Gratuit |
| **Supabase** | PostgreSQL | Gratuit |
| **DigitalOcean** | Tout-en-un | ~12$/mois |

---

## 💰 Business model
- **10 000 FCFA/mois** par client
- 50 clients = **500 000 FCFA/mois**
- 100 clients = **1 000 000 FCFA/mois**
