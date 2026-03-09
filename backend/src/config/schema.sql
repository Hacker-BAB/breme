-- ============================================
-- BREME - Schéma base de données PostgreSQL
-- Exécuter ce fichier pour créer toutes les tables
-- Commande : psql -U postgres -d breme_db -f schema.sql
-- ============================================

-- Extension UUID
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- TABLE UTILISATEURS
-- ============================================
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(100) NOT NULL,
  email VARCHAR(150) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,        -- hashé avec bcrypt
  role VARCHAR(20) DEFAULT 'user',       -- 'user' ou 'admin'
  is_email_verified BOOLEAN DEFAULT FALSE,
  email_token VARCHAR(255),
  subscription_status VARCHAR(20) DEFAULT 'inactive', -- 'inactive', 'active', 'suspended'
  subscription_end TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- ============================================
-- TABLE PAIEMENTS
-- ============================================
CREATE TABLE IF NOT EXISTS payments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  amount INTEGER NOT NULL,               -- en FCFA
  method VARCHAR(50) NOT NULL,           -- 'orange_money', 'usdt', 'eth', 'btc'
  status VARCHAR(20) DEFAULT 'pending',  -- 'pending', 'confirmed', 'rejected'
  transaction_id VARCHAR(255),           -- ID de transaction externe
  receipt_url VARCHAR(500),             -- URL reçu uploadé
  payment_proof TEXT,                   -- preuve manuelle (screenshot, etc.)
  confirmed_at TIMESTAMP,
  confirmed_by UUID,                    -- admin qui a confirmé (si manuel)
  notes TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- ============================================
-- TABLE CAMIONS
-- ============================================
CREATE TABLE IF NOT EXISTS trucks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  matricule VARCHAR(50) NOT NULL,
  marque VARCHAR(100),
  modele VARCHAR(100),
  annee INTEGER,
  couleur VARCHAR(50),
  driver_id UUID,                        -- référence chauffeur assigné
  status VARCHAR(20) DEFAULT 'active',   -- 'active', 'maintenance', 'inactive'
  notes TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- ============================================
-- TABLE CHAUFFEURS
-- ============================================
CREATE TABLE IF NOT EXISTS drivers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  nom VARCHAR(100) NOT NULL,
  telephone VARCHAR(20),
  email VARCHAR(150),
  numero_permis VARCHAR(100),
  types_permis VARCHAR(50),             -- ex: 'B,C,D'
  date_naissance DATE,
  date_embauche DATE,
  status VARCHAR(20) DEFAULT 'active',
  photo_url VARCHAR(500),
  notes TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Ajouter FK chauffeur dans camions
ALTER TABLE trucks ADD CONSTRAINT fk_driver
  FOREIGN KEY (driver_id) REFERENCES drivers(id) ON DELETE SET NULL;

-- ============================================
-- TABLE DOCUMENTS
-- ============================================
CREATE TABLE IF NOT EXISTS documents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  truck_id UUID REFERENCES trucks(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  type VARCHAR(50) NOT NULL,            -- 'assurance','visite_technique','carte_grise','permis'
  numero VARCHAR(100),
  date_emission DATE,
  date_expiration DATE NOT NULL,
  file_url VARCHAR(500),
  status VARCHAR(20) DEFAULT 'valid',   -- 'valid', 'expiring_soon', 'expired'
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- ============================================
-- INDEX pour performances
-- ============================================
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_payments_user ON payments(user_id);
CREATE INDEX IF NOT EXISTS idx_trucks_user ON trucks(user_id);
CREATE INDEX IF NOT EXISTS idx_drivers_user ON drivers(user_id);
CREATE INDEX IF NOT EXISTS idx_documents_truck ON documents(truck_id);
CREATE INDEX IF NOT EXISTS idx_documents_expiration ON documents(date_expiration);

-- ============================================
-- ADMIN PAR DÉFAUT (changer le mot de passe!)
-- mot de passe: Admin@Breme2025 (hashé)
-- ============================================
INSERT INTO users (name, email, password, role, is_email_verified, subscription_status)
VALUES (
  'Administrateur BREME',
  'admin@breme.com',
  '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', -- hash bcrypt de 'password' (CHANGER EN PROD!)
  'admin',
  TRUE,
  'active'
) ON CONFLICT (email) DO NOTHING;
