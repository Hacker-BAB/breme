// frontend/src/i18n/translations.js
// Toutes les traductions FR / EN de la plateforme BREME

const translations = {

  fr: {
    // Navigation
    nav: {
      features: "Fonctionnalités",
      pricing: "Tarif",
      about: "À propos",
      payment: "Paiement",
      login: "Se connecter",
      register: "S'inscrire",
      dashboard: "Tableau de bord",
      logout: "Se déconnecter"
    },

    // Hero
    hero: {
      badge: "SaaS Gestion de Flotte · Afrique",
      title1: "GÉREZ VOTRE",
      title2: "FLOTTE",
      title3: "INTELLIGEMMENT",
      subtitle: "Camions · Chauffeurs · Documents · Alertes",
      desc: "Plateforme tout-en-un pour transporteurs africains. Gérez vos camions, chauffeurs et documents en temps réel. Abonnement à 10 000 FCFA/mois.",
      cta_primary: "Commencer maintenant",
      cta_secondary: "Voir les fonctionnalités",
      stat1: "FCFA / mois",
      stat2: "modules clés",
      stat3: "Sécurisé",
      stat4: "Disponible"
    },

    // Features
    features: {
      label: "Fonctionnalités",
      title: "Tout ce dont vous avez besoin",
      sub: "Un système complet pour gérer votre parc de camions, chauffeurs et documents.",
      items: [
        { title: "Gestion Camions", desc: "Ajoutez, modifiez et suivez chaque camion. Historique complet et assignation chauffeur." },
        { title: "Gestion Chauffeurs", desc: "Profil complet : nom, téléphone, permis. Liaison directe camion-chauffeur." },
        { title: "Documents Véhicules", desc: "Assurance, visite technique, carte grise. Alertes d'expiration automatiques." },
        { title: "Alertes & Rappels", desc: "Notifications avant l'expiration de vos documents critiques." },
        { title: "Tableau de bord", desc: "Vue d'ensemble de toute votre flotte. Statistiques et rapports clairs." },
        { title: "Sécurité maximale", desc: "JWT, bcrypt, HTTPS, protection SQL injection et XSS." }
      ]
    },

    // Pricing
    pricing: {
      label: "Tarif",
      title: "Un seul abonnement, tout inclus",
      sub: "Simple, transparent, sans frais cachés.",
      badge: "Offre unique",
      price: "10 000",
      period: "FCFA / mois · Accès complet",
      features: [
        "Gestion illimitée de camions",
        "Gestion des chauffeurs",
        "Suivi des documents véhicules",
        "Alertes d'expiration automatiques",
        "Tableau de bord complet",
        "Support technique inclus",
        "Mises à jour gratuites"
      ],
      cta: "S'abonner — 10 000 FCFA/mois"
    },

    // Payment
    payment: {
      label: "Paiement",
      title: "Options de paiement",
      sub: "Local ou international, choisissez votre méthode.",
      om_title: "Orange Money",
      om_sub: "Paiement Mobile · Afrique francophone",
      om_account: "Compte vérifié BREME ✓",
      om_label: "Numéro de dépôt",
      copy_number: "Copier le numéro",
      copied: "Copié !",
      amount_label: "Montant abonnement mensuel",
      steps_title: "Comment payer",
      om_steps: [
        "Ouvrez Orange Money sur votre téléphone",
        "Appuyez sur Envoyer de l'argent",
        "Saisissez le numéro +237 699 959 921",
        "Entrez 10 000 FCFA et votre nom en objet",
        "Envoyez le reçu par WhatsApp pour activer votre accès"
      ],
      crypto_title: "Cryptomonnaies",
      crypto_sub: "Pour les clients internationaux",
      copy_address: "Copier l'adresse",
      network_usdt: "TRC20 (Tron) · Recommandé",
      network_eth: "Réseau Ethereum (ERC20)",
      network_btc: "Réseau Bitcoin (BTC)",
      warn_usdt: "Utilisez uniquement le réseau TRC20. Un mauvais réseau entraîne la perte des fonds.",
      warn_eth: "Vérifiez les frais de gas avant d'envoyer.",
      warn_btc: "Attendez 3 confirmations réseau. Conservez l'ID de transaction.",
      equivalent: "Équivalent 10 000 FCFA ≈"
    },

    // How it works
    how: {
      label: "Fonctionnement",
      title: "Comment accéder à BREME ?",
      sub: "Processus simple en 4 étapes. Votre accès est activé après confirmation du paiement.",
      steps: [
        { title: "Créez votre compte", desc: "Inscription rapide avec email et mot de passe sécurisé (chiffré bcrypt)." },
        { title: "Effectuez le paiement", desc: "10 000 FCFA via Orange Money ou Crypto. Envoyez le reçu à notre équipe." },
        { title: "Accès activé", desc: "Votre abonnement est activé après confirmation du paiement." },
        { title: "Gérez votre flotte", desc: "Ajoutez camions, chauffeurs et documents. Tout est centralisé." }
      ],
      banner_title: "Accès après paiement uniquement",
      banner_desc: "L'inscription crée votre compte. Le paiement l'active. Vous devez payer avant d'accéder aux fonctionnalités de la plateforme."
    },

    // About
    about: {
      label: "À propos de BREME",
      title: "La plateforme qui simplifie la gestion de flotte",
      sub: "BREME est un SaaS conçu pour les entreprises de transport africaines. Fini les Excel perdus, les documents expirés sans alerte.",
      features: [
        { title: "Flotte centralisée", desc: "Tous vos camions, chauffeurs et documents en un seul endroit." },
        { title: "Zéro document expiré", desc: "Alertes automatiques avant expiration de l'assurance, visite technique, carte grise." },
        { title: "Données sécurisées", desc: "Chiffrement JWT, HTTPS, protection SQL. Vos données restent privées." },
        { title: "Espace Admin puissant", desc: "Gérez utilisateurs, activez/suspendez les abonnements, consultez les paiements." }
      ]
    },

    // Auth
    auth: {
      register_title: "Créer votre compte",
      register_sub: "Inscription gratuite · Accès activé après paiement",
      login_title: "Se connecter",
      name_label: "Nom complet",
      email_label: "Adresse email",
      password_label: "Mot de passe",
      confirm_password: "Confirmer le mot de passe",
      register_btn: "Créer mon compte",
      login_btn: "Se connecter",
      already_account: "Déjà un compte ?",
      no_account: "Pas encore de compte ?",
      password_min: "Minimum 8 caractères"
    },

    // Dashboard
    dashboard: {
      title: "Tableau de bord",
      welcome: "Bienvenue",
      trucks: "Camions",
      drivers: "Chauffeurs",
      documents: "Documents",
      alerts: "Alertes",
      add_truck: "Ajouter un camion",
      add_driver: "Ajouter un chauffeur",
      add_document: "Ajouter un document",
      subscription_active: "Abonnement actif",
      subscription_inactive: "Abonnement inactif",
      subscription_expires: "Expire le",
      pay_now: "Payer maintenant",
      no_trucks: "Aucun camion enregistré.",
      no_drivers: "Aucun chauffeur enregistré.",
      expired: "Expiré",
      expiring_soon: "Expire bientôt",
      days_left: "jours restants"
    },

    // Common
    common: {
      save: "Enregistrer",
      cancel: "Annuler",
      delete: "Supprimer",
      edit: "Modifier",
      view: "Voir",
      confirm: "Confirmer",
      loading: "Chargement...",
      error: "Une erreur est survenue.",
      success: "Succès !",
      required: "Champ requis"
    },

    // Footer
    footer: {
      tagline: "Plateforme SaaS de gestion de flotte pour transporteurs africains.",
      platform: "Plateforme",
      features_link: "Fonctionnalités",
      pricing_link: "Tarif",
      register_link: "S'inscrire",
      login_link: "Se connecter",
      support: "Support",
      faq: "FAQ",
      whatsapp: "WhatsApp",
      contact: "Contact",
      refund: "Politique de remboursement",
      rights: "Tous droits réservés",
      country: "Cameroun 🇨🇲"
    }
  },

  // ============================================
  // ENGLISH
  // ============================================
  en: {
    nav: {
      features: "Features",
      pricing: "Pricing",
      about: "About",
      payment: "Payment",
      login: "Login",
      register: "Sign Up",
      dashboard: "Dashboard",
      logout: "Logout"
    },

    hero: {
      badge: "Fleet Management SaaS · Africa",
      title1: "MANAGE YOUR",
      title2: "FLEET",
      title3: "INTELLIGENTLY",
      subtitle: "Trucks · Drivers · Documents · Alerts",
      desc: "All-in-one platform for African transporters. Manage your trucks, drivers and documents in real time. Subscription at 10,000 FCFA/month.",
      cta_primary: "Get Started",
      cta_secondary: "See Features",
      stat1: "FCFA / month",
      stat2: "key modules",
      stat3: "Secure",
      stat4: "Available"
    },

    features: {
      label: "Features",
      title: "Everything you need",
      sub: "A complete system to manage your truck fleet, drivers and documents.",
      items: [
        { title: "Truck Management", desc: "Add, edit and track each truck. Full history and driver assignment." },
        { title: "Driver Management", desc: "Full profile: name, phone, license. Direct truck-driver link." },
        { title: "Vehicle Documents", desc: "Insurance, technical inspection, registration. Automatic expiry alerts." },
        { title: "Alerts & Reminders", desc: "Notifications before your critical documents expire." },
        { title: "Dashboard", desc: "Overview of your entire fleet. Clear stats and reports." },
        { title: "Maximum Security", desc: "JWT, bcrypt, HTTPS, SQL injection and XSS protection." }
      ]
    },

    pricing: {
      label: "Pricing",
      title: "One subscription, everything included",
      sub: "Simple, transparent, no hidden fees.",
      badge: "Single plan",
      price: "10,000",
      period: "FCFA / month · Full access",
      features: [
        "Unlimited truck management",
        "Driver management",
        "Vehicle document tracking",
        "Automatic expiry alerts",
        "Full dashboard",
        "Technical support included",
        "Free updates"
      ],
      cta: "Subscribe — 10,000 FCFA/month"
    },

    payment: {
      label: "Payment",
      title: "Payment Options",
      sub: "Local or international, choose your preferred method.",
      om_title: "Orange Money",
      om_sub: "Mobile Payment · Francophone Africa",
      om_account: "Verified BREME Account ✓",
      om_label: "Deposit Number",
      copy_number: "Copy Number",
      copied: "Copied!",
      amount_label: "Monthly subscription amount",
      steps_title: "How to pay",
      om_steps: [
        "Open Orange Money on your phone",
        "Tap Send Money",
        "Enter number +237 699 959 921",
        "Enter 10,000 FCFA and your name as reference",
        "Send the receipt via WhatsApp to activate your access"
      ],
      crypto_title: "Cryptocurrencies",
      crypto_sub: "For international clients",
      copy_address: "Copy Address",
      network_usdt: "TRC20 (Tron) · Recommended",
      network_eth: "Ethereum Network (ERC20)",
      network_btc: "Bitcoin Network (BTC)",
      warn_usdt: "Use TRC20 network only. Wrong network = lost funds.",
      warn_eth: "Check gas fees before sending.",
      warn_btc: "Wait 3 network confirmations. Keep your transaction ID.",
      equivalent: "Equivalent of 10,000 FCFA ≈"
    },

    how: {
      label: "How It Works",
      title: "How to access BREME?",
      sub: "Simple 4-step process. Your access is activated after payment confirmation.",
      steps: [
        { title: "Create your account", desc: "Quick signup with email and secure password (bcrypt encrypted)." },
        { title: "Make payment", desc: "10,000 FCFA via Orange Money or Crypto. Send receipt to our team." },
        { title: "Access activated", desc: "Your subscription is activated after payment confirmation." },
        { title: "Manage your fleet", desc: "Add trucks, drivers and documents. Everything centralized." }
      ],
      banner_title: "Access after payment only",
      banner_desc: "Registration creates your account. Payment activates it. You must pay before accessing platform features."
    },

    about: {
      label: "About BREME",
      title: "The platform that simplifies fleet management",
      sub: "BREME is a SaaS designed for African transport companies. No more lost Excel files or expired documents without alerts.",
      features: [
        { title: "Centralized fleet", desc: "All your trucks, drivers and documents in one place." },
        { title: "Zero expired documents", desc: "Automatic alerts before insurance, inspection, registration expires." },
        { title: "Secure data", desc: "JWT encryption, HTTPS, SQL protection. Your data stays private." },
        { title: "Powerful Admin space", desc: "Manage users, activate/suspend subscriptions, view payments." }
      ]
    },

    auth: {
      register_title: "Create your account",
      register_sub: "Free signup · Access activated after payment",
      login_title: "Sign in",
      name_label: "Full name",
      email_label: "Email address",
      password_label: "Password",
      confirm_password: "Confirm password",
      register_btn: "Create account",
      login_btn: "Sign in",
      already_account: "Already have an account?",
      no_account: "Don't have an account?",
      password_min: "Minimum 8 characters"
    },

    dashboard: {
      title: "Dashboard",
      welcome: "Welcome",
      trucks: "Trucks",
      drivers: "Drivers",
      documents: "Documents",
      alerts: "Alerts",
      add_truck: "Add truck",
      add_driver: "Add driver",
      add_document: "Add document",
      subscription_active: "Active subscription",
      subscription_inactive: "Inactive subscription",
      subscription_expires: "Expires on",
      pay_now: "Pay now",
      no_trucks: "No trucks registered.",
      no_drivers: "No drivers registered.",
      expired: "Expired",
      expiring_soon: "Expiring soon",
      days_left: "days left"
    },

    common: {
      save: "Save",
      cancel: "Cancel",
      delete: "Delete",
      edit: "Edit",
      view: "View",
      confirm: "Confirm",
      loading: "Loading...",
      error: "An error occurred.",
      success: "Success!",
      required: "Required field"
    },

    footer: {
      tagline: "Fleet management SaaS platform for African transporters.",
      platform: "Platform",
      features_link: "Features",
      pricing_link: "Pricing",
      register_link: "Sign Up",
      login_link: "Login",
      support: "Support",
      faq: "FAQ",
      whatsapp: "WhatsApp",
      contact: "Contact",
      refund: "Refund policy",
      rights: "All rights reserved",
      country: "Cameroon 🇨🇲"
    }
  }
};

// ── Hook simple pour utiliser les traductions ──
let currentLang = localStorage.getItem('breme_lang') || 'fr';

function setLang(lang) {
  currentLang = lang;
  localStorage.setItem('breme_lang', lang);
  document.documentElement.lang = lang;
  document.dispatchEvent(new CustomEvent('langChange', { detail: lang }));
}

function t(path) {
  const keys = path.split('.');
  let val = translations[currentLang];
  for (const k of keys) {
    if (val === undefined) return path;
    val = val[k];
  }
  return val ?? path;
}

function getLang() { return currentLang; }

module.exports = { translations, t, setLang, getLang };
