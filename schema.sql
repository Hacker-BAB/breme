CREATE TABLE IF NOT EXISTS users (
  id               SERIAL PRIMARY KEY,
  name             VARCHAR(150) NOT NULL,
  email            VARCHAR(150) UNIQUE NOT NULL,
  password_hash    VARCHAR(255) NOT NULL,
  role             VARCHAR(20) DEFAULT 'user',
  subscription_end TIMESTAMP DEFAULT NOW(),
  created_at       TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS drivers (
  id         SERIAL PRIMARY KEY,
  nom        VARCHAR(150) NOT NULL,
  telephone  VARCHAR(20) NOT NULL,
  permis     VARCHAR(50) NOT NULL,
  user_id    INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS trucks (
  id           SERIAL PRIMARY KEY,
  matricule    VARCHAR(20) NOT NULL,
  marque       VARCHAR(100) NOT NULL,
  modele       VARCHAR(100) NOT NULL,
  chauffeur_id INTEGER REFERENCES drivers(id) ON DELETE SET NULL,
  user_id      INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  created_at   TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS documents (
  id         SERIAL PRIMARY KEY,
  truck_id   INTEGER NOT NULL REFERENCES trucks(id) ON DELETE CASCADE,
  type       VARCHAR(50) NOT NULL,
  expiration DATE NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS payments (
  id               SERIAL PRIMARY KEY,
  user_id          INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  montant          INTEGER NOT NULL DEFAULT 10000,
  methode          VARCHAR(50) DEFAULT 'Orange Money',
  transaction_code VARCHAR(100),
  payer_phone      VARCHAR(30),
  status           VARCHAR(20) DEFAULT 'pending',
  created_at       TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS verified_transactions (
  id               SERIAL PRIMARY KEY,
  transaction_code VARCHAR(100) UNIQUE NOT NULL,
  used             BOOLEAN DEFAULT false,
  used_at          TIMESTAMP,
  added_by         INTEGER REFERENCES users(id),
  created_at       TIMESTAMP DEFAULT NOW()
);

INSERT INTO users (name, email, password_hash, role, subscription_end)
VALUES (
  'BRELE AHMAT BREME',
  'admin@breme.com',
  '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi',
  'admin',
  '2099-12-31'
) ON CONFLICT (email) DO NOTHING;